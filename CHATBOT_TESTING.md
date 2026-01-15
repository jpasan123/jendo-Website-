# Chatbot Testing Guide

## Quick Test Commands

### Test the API directly:

```bash
# Test Rule-Based Response (Tier 1) - Greeting
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test Rule-Based Response (Tier 1) - About Jendo
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Jendo?"}'

# Test Rule-Based Response (Tier 1) - How it works
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "How does the test work?"}'

# Test Rule-Based Response (Tier 1) - Pricing
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "How much does it cost?"}'

# Test Rule-Based Response (Tier 1) - Contact
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Contact information"}'

# Test AI Response (Tier 2) - Complex query
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the early warning signs of cardiovascular disease?"}'

# Health Check
curl http://localhost:3001/api/chatbot
```

## Browser Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3001 in your browser

3. Look for the floating chatbot button (bottom-right corner with Jendo logo)

4. Click the button to open the chat window

5. Test these queries:

### Quick Tests (Tier 1 - Instant responses):
- "Hello"
- "What is Jendo?"
- "How does it work?"
- "Is it safe?"
- "Tell me about your patents"
- "How much does it cost?"
- "Contact information"

### Complex Tests (Tier 2 - AI responses):
- "What are the symptoms of heart disease?"
- "How can I prevent cardiovascular problems?"
- "What is blood pressure?"

## Expected Results

### Tier 1 (Rule-Based):
- ✅ Response in < 10ms
- ✅ Detailed, formatted information
- ✅ Includes emojis and structure
- ✅ Contains medical disclaimer

### Tier 2 (AI-Powered):
- ✅ Response in 2-5 seconds
- ✅ "Thinking..." indicator shown
- ✅ Natural language response
- ✅ Includes medical disclaimer

### Tier 3 (Fallback):
- ✅ Used when AI fails
- ✅ Comprehensive Jendo information
- ✅ Contact details provided
- ✅ Never shows errors

## Visual Checks

- ✅ Chat button visible in bottom-right
- ✅ Jendo logo displayed clearly
- ✅ Purple gradient header
- ✅ Messages formatted correctly (bold text works)
- ✅ Timestamps shown for each message
- ✅ Loading indicator appears when processing
- ✅ Responsive on mobile (test by resizing browser)
- ✅ Smooth animations

## Common Issues & Solutions

### Issue: API returns 404
**Solution**: Make sure you're running `npm run dev` and the server is on port 3001

### Issue: AI responses take too long
**Solution**: This is normal for first request (model cold start). Subsequent requests are faster.

### Issue: AI responses fail
**Solution**: The fallback (Tier 3) will automatically provide a response. No errors shown to users.

### Issue: Chatbot button not visible
**Solution**: Check if chat-bot.tsx is imported in your main layout/page component

## Success Checklist

- [ ] Chat button appears on homepage
- [ ] Welcome message displays with formatting
- [ ] Rule-based responses are instant
- [ ] AI responses work for complex queries
- [ ] Fallback works when needed
- [ ] No errors shown to users
- [ ] Mobile responsive
- [ ] Timestamps display correctly
- [ ] Loading states work
- [ ] Can send multiple messages
- [ ] Conversation history maintained

---

**Status**: All tests should pass! ✅
