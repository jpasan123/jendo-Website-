# Jendo Health Chatbot - Correct Implementation

## ✅ FIXED: No Hardcoded Responses

The chatbot now properly calls your **Spring Boot backend** for all intelligent responses.

## 🏗️ Correct Architecture

```
User → Frontend (chat-bot.tsx)
         ↓
    Next.js Proxy (/api/chatbot/route.ts)
         ↓
┌──────────────────────────────────────┐
│ TIER 1: Spring Boot Backend          │ ← PRIMARY (Your hosted backend)
│ http://localhost:8080/api/chatbot/   │
│ message                              │
│                                      │
│ Your backend has:                    │
│ - Rule-based responses               │
│ - AI integration                     │
│ - Database-driven content            │
│ - Real-time updates                  │
└──────────────────────────────────────┘
         ↓ (if backend unavailable)
┌──────────────────────────────────────┐
│ TIER 2: Hugging Face AI Direct       │ ← SECONDARY FALLBACK
│ - DialoGPT-medium                    │
│ - DialoGPT-small                     │
│ - Free public API                    │
└──────────────────────────────────────┘
         ↓ (if AI also fails)
┌──────────────────────────────────────┐
│ TIER 3: Simple Fallback              │ ← ALWAYS AVAILABLE
│ - Contact information only           │
│ - No hardcoded Q&A                   │
└──────────────────────────────────────┘
```

## 🎯 What Changed

### ❌ REMOVED:
- All hardcoded questions and answers
- Rule-based pattern matching in frontend
- Static responses

### ✅ ADDED:
- Proxy to Spring Boot backend at `localhost:8080`
- Direct Hugging Face API fallback
- Configuration via environment variables

## 📁 Files

1. **`/app/api/chatbot/route.ts`**
   - Acts as a proxy to your Spring Boot backend
   - Fallback to Hugging Face if backend unavailable
   - Simple contact fallback if everything fails

2. **`/components/ui/chat-bot.tsx`**
   - Frontend UI component (unchanged)
   - Calls Next.js API route
   - No hardcoded responses

3. **`.env.local.example`**
   - Configuration template

## 🚀 Setup

### Step 1: Start Your Spring Boot Backend

```bash
# Make sure your Spring Boot backend is running on:
http://localhost:8080

# Test endpoint:
curl -X POST http://localhost:8080/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Step 2: Configure Next.js

Create `.env.local`:

```bash
# Your Spring Boot backend URL
CHATBOT_BACKEND_URL=http://localhost:8080/api/chatbot/message

# Optional: Hugging Face token for higher rate limits
HUGGINGFACE_TOKEN=your_token_here
```

### Step 3: Start Next.js

```bash
npm run dev
```

Visit: http://localhost:3001

## 🔄 How It Works

### Normal Flow (Backend Available):
1. User sends message
2. Next.js proxy forwards to Spring Boot backend
3. Backend processes with its three-tier system:
   - Rule-based patterns
   - AI responses
   - Backend's own fallbacks
4. Response returned to user

### Fallback Flow (Backend Down):
1. User sends message
2. Next.js proxy tries backend → fails
3. Calls Hugging Face AI directly
4. If AI fails → shows contact information

## 📊 API Contract

### Request to Next.js:
```json
POST /api/chatbot
{
  "message": "What is Jendo?",
  "history": []
}
```

### Next.js Forwards to Spring Boot:
```json
POST http://localhost:8080/api/chatbot/message
{
  "message": "What is Jendo?",
  "history": []
}
```

### Expected Response Format:
```json
{
  "id": "assistant-uuid-123",
  "role": "assistant",
  "content": "Jendo is...",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

## 🧪 Testing

### Test Backend Connectivity:
```bash
# Check if backend is reachable
curl http://localhost:3001/api/chatbot

# Should return:
{
  "status": "operational",
  "service": "Jendo Health Chatbot Proxy",
  "backend": {
    "url": "http://localhost:8080/api/chatbot/message",
    "status": "healthy" | "unhealthy" | "unreachable"
  },
  ...
}
```

### Test Chatbot:
1. Open http://localhost:3001
2. Click chatbot button (bottom-right)
3. Send message: "Hello"
4. Check browser console logs:
   - ✅ `🔄 Calling Spring Boot backend`
   - ✅ `✅ Backend API response received`

### Test Fallback:
1. Stop Spring Boot backend
2. Send message
3. Should see:
   - ⚠️ `Backend unavailable, trying Hugging Face AI...`
   - ✅ `Using Hugging Face AI response`

## 🔧 Configuration Options

### Production Backend URL

For production, update `.env.local`:

```bash
CHATBOT_BACKEND_URL=https://your-backend.com/api/chatbot/message
```

### Add Hugging Face Token

For higher rate limits (1000+/hour):

1. Get token: https://huggingface.co/settings/tokens
2. Add to `.env.local`:
   ```bash
   HUGGINGFACE_TOKEN=hf_your_token_here
   ```

## 📝 Updating Responses

### To Update Chatbot Responses:

**✅ DO THIS:** Update your Spring Boot backend
- Edit pattern matching rules
- Update database content
- Modify AI prompts
- Add new topics

**❌ DON'T DO THIS:** Edit Next.js code
- No frontend changes needed
- Proxy remains the same
- All logic in backend

## 🐛 Troubleshooting

### Issue: "Backend unavailable"

**Check:**
```bash
# Is Spring Boot running?
curl http://localhost:8080/api/chatbot/test

# Is URL correct in .env.local?
cat .env.local
```

**Fix:**
- Start Spring Boot backend
- Verify URL in `.env.local`
- Check firewall/network

### Issue: Chatbot not responding

**Check browser console:**
- Look for API errors
- Check network tab
- Verify request/response format

**Check terminal logs:**
- `🔄 Calling Spring Boot backend` → Request sent
- `❌ Backend API error` → Connection problem
- `✅ Backend API response received` → Success

### Issue: Responses are generic

**This means:**
- Backend is down → Using Hugging Face fallback
- Both failed → Using simple contact fallback

**Fix:**
- Ensure Spring Boot is running
- Check backend logs
- Verify backend response format

## ✅ Success Checklist

- [ ] Spring Boot backend running on port 8080
- [ ] `.env.local` configured with correct backend URL
- [ ] Next.js running on port 3001
- [ ] Browser shows chatbot button
- [ ] Sending "Hello" gets response from backend
- [ ] Backend logs show incoming requests
- [ ] No hardcoded responses in Next.js code

## 📞 Architecture Summary

**Frontend (Next.js)**
- UI only
- No business logic
- Simple proxy

**Backend (Spring Boot)**
- All intelligent responses
- Rule-based matching
- AI integration
- Database content
- Real-time updates

**Fallbacks**
- Tier 1: Your backend (primary)
- Tier 2: Hugging Face (if backend down)
- Tier 3: Contact info (if all fail)

---

**Status**: ✅ **CORRECTLY IMPLEMENTED**

- No hardcoded responses in frontend
- All intelligence in your Spring Boot backend
- Proper proxy architecture
- Multiple fallback layers
- Production ready

**Made with ❤️ for better cardiovascular health**
