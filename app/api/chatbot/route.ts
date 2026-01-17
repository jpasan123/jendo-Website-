import { NextRequest, NextResponse } from 'next/server';

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

// Backend API Configuration
const BACKEND_API_URL = process.env.CHATBOT_BACKEND_URL || 'https://jendo.mytodoo.com/api/chatbot/message';
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN || '';

// TIER 1: Call Spring Boot Backend (Primary - with three-tier system built-in)
const callBackendAPI = async (message: string, history?: Array<{ role: string; content: string }>): Promise<ChatResponse | null> => {
  try {
    console.log('🔄 Calling Spring Boot backend at:', BACKEND_API_URL);
    
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history || []
      }),
      signal: AbortSignal.timeout(30000), // 30 second timeout for backend
    });

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

// TIER 3: Simple Fallback (Always Available)
const getFallbackResponse = (): string => {
  return `I apologize, but I'm having trouble connecting to our AI services right now.

📞 **Please contact our team directly:**
- **Phone:** 0766210120
- **Email:** info@jendoinnovations.com
- **Location:** Bay 09, Trace Expert City, Colombo 10, Sri Lanka

**Business Hours:**
Monday-Friday: 9:00 AM - 5:00 PM (Sri Lanka Time)

We're here to help you with:
🫀 Jendo technology and services
⚕️ Test procedures and booking
💓 Cardiovascular health information
📅 Appointments and pricing

⚠️ **For medical emergencies, please call 1990 (Sri Lanka Emergency Services)**`;
};

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

    let responseContent: string;
    let responseId: string;
    let responseTimestamp: string;

    // TIER 1: Try Spring Boot Backend (Primary - has built-in three-tier system)
    const backendResponse = await callBackendAPI(message, history);
    
    if (backendResponse) {
      console.log('✅ Using Spring Boot backend response');
      return NextResponse.json(backendResponse);
    }

    // TIER 2: Try Hugging Face AI (Secondary fallback)
    console.log('⚠️ Backend unavailable, trying Hugging Face AI...');
    const aiResponse = await callHuggingFaceAPI(message);
    
    if (aiResponse) {
      console.log('✅ Using Hugging Face AI response');
      responseContent = aiResponse;
      responseId = `assistant-hf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      responseTimestamp = new Date().toISOString();
    } else {
      // TIER 3: Use simple fallback (Always works)
      console.log('ℹ️ All services unavailable, using fallback response');
      responseContent = getFallbackResponse();
      responseId = `assistant-fallback-${Date.now()}`;
      responseTimestamp = new Date().toISOString();
    }

    const response: ChatResponse = {
      id: responseId,
      role: 'assistant',
      content: responseContent,
      timestamp: responseTimestamp,
    };

    return NextResponse.json(response);
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
export async function GET() {
  // Test backend connectivity
  let backendStatus = 'unknown';
  try {
    const testResponse = await fetch(BACKEND_API_URL.replace('/message', '/test'), {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    backendStatus = testResponse.ok ? 'healthy' : 'unhealthy';
  } catch {
    backendStatus = 'unreachable';
  }

  return NextResponse.json({
    status: 'operational',
    service: 'Jendo Health Chatbot Proxy',
    backend: {
      url: BACKEND_API_URL,
      status: backendStatus,
    },
    tiers: {
      tier1: 'Spring Boot Backend (Primary)',
      tier2: 'Hugging Face AI (Fallback)',
      tier3: 'Simple Fallback (Always Available)',
    },
    timestamp: new Date().toISOString(),
  });
}
