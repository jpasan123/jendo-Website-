/**
 * Jendo chatbot engine — rule-based tier ported from jendo-admin-backend
 * ChatbotServiceImpl (Tier 1). Keeps website chat working without the Spring Boot service.
 */

const RESPONSE_PATTERNS: Array<{ pattern: RegExp; response: string }> = [
  {
    pattern: /^(hi|hello|hey|good morning|good afternoon|good evening|greetings).*/i,
    response:
      "👋 Hello! I'm Jendo Health Assistant. I can help you learn about:\n\n" +
      '• Jendo cardiovascular health technology\n' +
      '• The Jendo non-invasive health test\n' +
      '• Cardiovascular health and prevention\n' +
      '• How to schedule a test\n\n' +
      'What would you like to know?',
  },
  {
    pattern: /.*(what is (the )?jendo|tell me about jendo|about jendo|jendo company).*/i,
    response:
      '🫀 **About Jendo**\n\n' +
      'Jendo is an AI-powered, non-invasive cardiovascular health technology designed for early detection of vascular dysfunction.\n\n' +
      '**Key Features:**\n' +
      '• Non-invasive and painless\n' +
      '• Uses Photoplethysmography (PPG) + Digital Thermal Monitoring (DTM)\n' +
      '• AI-driven analysis\n' +
      '• Early cardiovascular risk detection\n\n' +
      'Jendo supports early detection and preventive care but does not replace professional medical advice.',
  },
  {
    pattern: /.*(how does.*work|how it works|jendo technology|jendo test procedure|test process).*/i,
    response:
      '📋 **Jendo Health Test Procedure**\n\n' +
      '**Duration:** Approximately 15 minutes\n\n' +
      '**Steps:**\n' +
      '1. You lie down comfortably in a supine position\n' +
      '2. PPG and DTM sensors extract vascular signals\n' +
      '3. Brief pressure cuff occlusion and release\n' +
      '4. Continued signal monitoring\n' +
      '5. Data uploaded to cloud for AI analysis\n\n' +
      '✅ **Completely non-invasive** - No needles, no radiation, painless!\n\n' +
      'Jendo supports early detection and preventive care but does not replace professional medical advice.',
  },
  {
    pattern: /.*(heart health|cardiovascular|heart disease|blood pressure|vascular health).*/i,
    response:
      '❤️ **Cardiovascular Health Information**\n\n' +
      'Cardiovascular disease (CVD) is a leading cause of mortality globally. Many conditions remain unnoticed until serious events occur.\n\n' +
      '**Jendo Measures:**\n' +
      '• Endothelial function (blood vessel lining health)\n' +
      '• Vascular reactivity\n' +
      '• Early cardiovascular risk indicators\n\n' +
      '**Vascular Health Score:**\n' +
      'Jendo generates a score for predictive cardiovascular risk assessment, enabling early risk identification and preventive monitoring.\n\n' +
      '⚠️ **Important:** This is NOT a medical diagnosis and must be interpreted by healthcare professionals.\n\n' +
      'Jendo supports early detection and preventive care but does not replace professional medical advice.',
  },
  {
    pattern: /.*(safe|safety|painful|pain|comfortable|radiation|invasive).*/i,
    response:
      '✅ **Jendo Test Safety & Comfort**\n\n' +
      'The Jendo test is:\n' +
      '• **Completely non-invasive** - No needles\n' +
      '• **No radiation**\n' +
      '• **Painless and comfortable**\n' +
      '• **Suitable for routine screening**\n' +
      '• **Quick** - Only 15 minutes\n\n' +
      "It's designed for preventive health monitoring with your comfort and safety as top priorities!",
  },
  {
    pattern: /.*(patent|patented|innovation|technology|research).*/i,
    response:
      '🔬 **Jendo Patented Technology**\n\n' +
      "Jendo's core technology is protected by patents in:\n" +
      '• 🇯🇵 Japan\n' +
      '• 🇱🇰 Sri Lanka\n' +
      '• 🇺🇸 USA\n\n' +
      '**Patent Coverage:**\n' +
      '• Non-invasive vascular assessment methods\n' +
      '• Advanced signal processing techniques\n' +
      '• AI-based cardiovascular risk analysis\n\n' +
      'Our technology represents cutting-edge innovation in preventive cardiovascular health.',
  },
  {
    pattern: /.*(price|cost|how much|booking|schedule|appointment|availability|book appointment).*/i,
    response:
      '📅 **Scheduling & Availability**\n\n' +
      'To schedule a Jendo Health Test or inquire about pricing:\n\n' +
      '📞 **Call us:** 0766210120\n' +
      '📧 **Email:** info@jendoinnovations.com\n' +
      '🌐 **Website:** https://www.jendo.health/\n\n' +
      'Our team will be happy to assist you with scheduling and provide detailed information about test availability and pricing.',
  },
  {
    pattern: /.*(contact|address|location|phone|email|reach you|contact us).*/i,
    response:
      '📞 **Contact Jendo**\n\n' +
      '**Jendo Incorporation (USA)**\n' +
      '📍 251, Little Falls Drive, Wilmington, New Castle County, Delaware\n' +
      '📧 info@jendoinnovations.com\n' +
      '📞 0766210120\n\n' +
      '**AI Health R&D Centre**\n' +
      '📍 Bay X, Trace Expert City\n' +
      '📧 info@jendoinnovations.com\n' +
      '📞 0766210120\n\n' +
      '🌐 **Website:** https://www.jendo.health/',
  },
];

export function getRuleBasedResponse(message: string): string | null {
  const normalized = message.trim();

  for (const { pattern, response } of RESPONSE_PATTERNS) {
    if (pattern.test(normalized)) {
      return response;
    }
  }

  return null;
}

export function getComprehensiveFallback(): string {
  return `Thank you for your question! While I don't have a specific answer right now, I'm here to help you learn about Jendo cardiovascular health technology.

🫀 **Quick Facts About Jendo:**
• Non-invasive cardiovascular health assessment
• AI-powered early risk detection
• 15-minute painless test
• Patented technology (USA, Japan, Sri Lanka)

📋 **Common Topics I Can Help With:**
• How the Jendo test works
• Cardiovascular health information
• Test safety and comfort
• Scheduling and availability
• Our patented technology

📞 **Need More Information?**

**Contact Us:**
• Phone: 0766210120
• Email: info@jendoinnovations.com
• Website: https://www.jendo.health/

**Jendo Incorporation (USA)**
📍 251, Little Falls Drive, Wilmington, New Castle County, Delaware

**AI Health R&D Centre**
📍 Bay X, Trace Expert City

Feel free to ask me anything about Jendo technology or cardiovascular health!

⚠️ **Important:** Jendo supports early detection and preventive care but does not replace professional medical advice.`;
}

export function buildChatResponse(content: string, suffix = '') {
  const id = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    role: 'assistant' as const,
    content: suffix ? `${content}${suffix}` : content,
    timestamp: new Date().toISOString(),
  };
}
