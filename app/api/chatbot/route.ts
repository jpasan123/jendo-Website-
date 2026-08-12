import { NextRequest, NextResponse } from 'next/server';
import {
  buildChatResponse,
  getComprehensiveFallback,
  getRuleBasedResponse,
} from '@/lib/chatbot-engine';

interface ChatMessage {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

interface ChatResponse {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

interface AuthLoginResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    user?: unknown;
  };
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

interface CachedAccessToken {
  token: string;
  expiresAt: number | null;
}

// Optional remote backend — only used when CHATBOT_BACKEND_URL is explicitly set
const BACKEND_API_URL = process.env.CHATBOT_BACKEND_URL?.trim() || '';
const AUTH_SERVICE_URL = process.env.CHATBOT_AUTH_URL?.trim() || 'http://188.166.240.119:8080/api/auth/login';
const AUTH_SERVICE_EMAIL = process.env.CHATBOT_AUTH_EMAIL?.trim() || '';
const AUTH_SERVICE_PASSWORD = process.env.CHATBOT_AUTH_PASSWORD?.trim() || '';
const BACKEND_AUTH_TOKEN = process.env.CHATBOT_BACKEND_TOKEN?.trim() || process.env.CHATBOT_SERVICE_TOKEN?.trim() || '';
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN || '';
let cachedAccessToken: CachedAccessToken | null = null;

const getJwtExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = Buffer.from(normalizedPayload, 'base64').toString('utf8');
    const parsed = JSON.parse(decodedPayload) as { exp?: number };

    return typeof parsed.exp === 'number' ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
};

const extractAccessToken = (responseBody: AuthLoginResponse): string | null => {
  const nestedToken = responseBody.data?.accessToken;

  if (nestedToken) {
    return nestedToken;
  }

  if (responseBody.accessToken) {
    return responseBody.accessToken;
  }

  return null;
};

const loginToAuthService = async (): Promise<string | null> => {
  if (!AUTH_SERVICE_EMAIL || !AUTH_SERVICE_PASSWORD) {
    return null;
  }

  if (cachedAccessToken && (!cachedAccessToken.expiresAt || cachedAccessToken.expiresAt > Date.now() + 30_000)) {
    return cachedAccessToken.token;
  }

  try {
    console.log('🔐 Logging in to auth service at:', AUTH_SERVICE_URL);

    const response = await fetch(AUTH_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({
        email: AUTH_SERVICE_EMAIL,
        password: AUTH_SERVICE_PASSWORD,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn('⚠️ Auth login failed with status:', response.status);
      return null;
    }

    const data = (await response.json()) as AuthLoginResponse;
    const accessToken = extractAccessToken(data);

    if (!accessToken) {
      console.warn('⚠️ Auth login response did not include an access token');
      return null;
    }

    const expiresAt = getJwtExpiry(accessToken);
    cachedAccessToken = { token: accessToken, expiresAt };
    return accessToken;
  } catch (error) {
    console.error('❌ Auth login error:', error);
    return null;
  }
};

const getBackendAuthHeader = async (incomingAuthorization?: string | null, incomingCookieToken?: string | null) => {
  if (incomingAuthorization) {
    return incomingAuthorization;
  }

  if (incomingCookieToken) {
    return incomingCookieToken.startsWith('Bearer ')
      ? incomingCookieToken
      : `Bearer ${incomingCookieToken}`;
  }

  if (BACKEND_AUTH_TOKEN) {
    return `Bearer ${BACKEND_AUTH_TOKEN}`;
  }

  const loggedInToken = await loginToAuthService();

  if (loggedInToken) {
    return `Bearer ${loggedInToken}`;
  }

  return null;
};

const getBackendTestUrl = () => {
  try {
    const backendUrl = new URL(BACKEND_API_URL);
    backendUrl.pathname = backendUrl.pathname.replace(/\/message\/?$/, '/test');
    return backendUrl.toString();
  } catch {
    return BACKEND_API_URL.replace('/message', '/test');
  }
};

// TIER 1: Call Spring Boot Backend (Primary - with three-tier system built-in)
const callBackendAPI = async (
  request: NextRequest,
  message: string,
  history?: Array<{ role: string; content: string }>
): Promise<ChatResponse | null> => {
  if (!BACKEND_API_URL) {
    return null;
  }

  try {
    console.log('🔄 Calling Spring Boot backend at:', BACKEND_API_URL);

    const authorizationHeader = await getBackendAuthHeader(
      request.headers.get('authorization'),
      request.cookies.get('auth-token')?.value ?? request.cookies.get('token')?.value ?? null
    );
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authorizationHeader) {
      headers.Authorization = authorizationHeader;
    }
    
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        history: history || []
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout for backend
    });

    if ((response.status === 401 || response.status === 403) && !authorizationHeader && !BACKEND_AUTH_TOKEN) {
      const retriedToken = await loginToAuthService();

      if (retriedToken) {
        const retryResponse = await fetch(BACKEND_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${retriedToken}`,
          },
          body: JSON.stringify({
            message,
            history: history || [],
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (retryResponse.ok) {
          const retryData: ChatResponse = await retryResponse.json();
          console.log('✅ Backend API response received after auth retry');
          return retryData;
        }

        console.warn('⚠️ Backend API still rejected request after auth retry:', retryResponse.status);
      }
    }

    if (!response.ok) {
      console.warn('⚠️ Backend API returned status:', response.status);
      return null;
    }

    const data: ChatResponse = await response.json();
    console.log('✅ Backend API response received');
    return data;
  } catch (error) {
    console.error('❌ Backend API error:', error);
    return null;
  }
};

// TIER 2: Hugging Face AI API (Fallback if backend unavailable)
const callHuggingFaceAPI = async (message: string): Promise<string | null> => {
  const models = [
    'microsoft/DialoGPT-medium',
    'microsoft/DialoGPT-small'
  ];

  for (const model of models) {
    try {
      console.log(`🤖 Trying Hugging Face model: ${model}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token is available
      if (HUGGINGFACE_TOKEN) {
        headers['Authorization'] = `Bearer ${HUGGINGFACE_TOKEN}`;
      }
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            inputs: message,
            parameters: {
              max_length: 200,
              temperature: 0.7,
              top_p: 0.9,
              return_full_text: false,
            },
          }),
          signal: AbortSignal.timeout(15000), // 15 second timeout
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.generated_text) {
          const aiResponse = data.generated_text.trim();
          console.log('✅ Hugging Face AI response received');
          return `${aiResponse}\n\n⚠️ **Important:** Jendo supports early detection and preventive care but does not replace professional medical advice. For specific medical concerns, please consult with a healthcare professional.`;
        }
        
        if (Array.isArray(data) && data[0]?.generated_text) {
          const aiResponse = data[0].generated_text.trim();
          console.log('✅ Hugging Face AI response received');
          return `${aiResponse}\n\n⚠️ **Important:** Jendo supports early detection and preventive care but does not replace professional medical advice.`;
        }
      }
      
      console.warn(`⚠️ Hugging Face API (${model}) returned status:`, response.status);
    } catch (error) {
      console.error(`❌ Error with ${model}:`, error);
      continue; // Try next model
    }
  }

  return null; // All AI models failed
};

// TIER 4: Simple Fallback (Always Available)
const getFallbackResponse = (): string => getComprehensiveFallback();

// Main Handler - Three-Tier System
export async function POST(request: NextRequest) {
  try {
    const body: ChatMessage = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    console.log('📨 Received message:', message.substring(0, 50) + '...');

    // TIER 1: Local chatbot engine (chatbot-only — hosted on jendo.health server)
    const ruleBasedResponse = getRuleBasedResponse(message);
    if (ruleBasedResponse) {
      console.log('✅ Using local chatbot engine');
      return NextResponse.json(buildChatResponse(ruleBasedResponse));
    }

    // TIER 2: Optional remote Spring Boot backend (only if CHATBOT_BACKEND_URL is set)
    const backendResponse = await callBackendAPI(request, message, history);
    if (backendResponse) {
      console.log('✅ Using remote backend response');
      return NextResponse.json(backendResponse);
    }

    // TIER 3: Hugging Face AI
    console.log('⚠️ Backend unavailable, trying Hugging Face AI...');
    const aiResponse = await callHuggingFaceAPI(message);
    if (aiResponse) {
      console.log('✅ Using Hugging Face AI response');
      return NextResponse.json(buildChatResponse(aiResponse));
    }

    // TIER 4: Comprehensive fallback (always works)
    console.log('ℹ️ Using comprehensive fallback response');
    return NextResponse.json(buildChatResponse(getFallbackResponse()));
  } catch (error) {
    console.error('❌ Error processing chatbot message:', error);
    
    // Always return a fallback response, never show errors to users
    const fallbackResponse: ChatResponse = {
      id: `assistant-error-${Date.now()}`,
      role: 'assistant',
      content: getFallbackResponse(),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(fallbackResponse);
  }
}

// Health Check Endpoint
export async function GET(request: NextRequest) {
  // Test backend connectivity
  let backendStatus = BACKEND_API_URL ? 'unknown' : 'disabled';
  if (BACKEND_API_URL) {
  try {
    const authorizationHeader = await getBackendAuthHeader(
      request.headers.get('authorization'),
      request.cookies.get('auth-token')?.value ?? request.cookies.get('token')?.value ?? null
    );
    const headers: Record<string, string> = {};

    if (authorizationHeader) {
      headers.Authorization = authorizationHeader;
    }

    const testResponse = await fetch(getBackendTestUrl(), {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (testResponse.ok) {
      backendStatus = 'healthy';
    } else if (testResponse.status === 401 || testResponse.status === 403) {
      backendStatus = 'unauthorized';
    } else {
      backendStatus = 'unhealthy';
    }
  } catch {
    backendStatus = 'unreachable';
  }
  }

  return NextResponse.json({
    status: 'operational',
    service: 'Jendo Health Chatbot',
    backend: {
      url: BACKEND_API_URL || null,
      status: backendStatus,
    },
    tiers: {
      tier1: 'Local Chatbot Engine (jendo.health — chatbot-only)',
      tier2: 'Remote Backend (optional — CHATBOT_BACKEND_URL)',
      tier3: 'Hugging Face AI (Fallback)',
      tier4: 'Comprehensive Fallback (Always Available)',
    },
    timestamp: new Date().toISOString(),
  });
}
