'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Simple markdown-like text formatter
const formatMessage = (content: string) => {
  return content.split('\n').map((line, index) => {
    // Handle bold text (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = line.split(boldRegex);
    
    return (
      <p key={index} className="mb-2 last:mb-0">
        {parts.map((part, i) => {
          if (i % 2 === 1) {
            return <strong key={i} className="font-semibold">{part}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 **Welcome to Jendo Health!**

I'm your AI health assistant powered by a three-tier intelligent system. I can help you with:

🫀 **About Jendo** - Our technology and mission
⚕️ **How It Works** - Test procedure details
💓 **Heart Health** - Cardiovascular information
🛡️ **Safety** - Test safety and comfort
🏆 **Patents** - Our innovations
📅 **Booking** - Appointments and pricing
📞 **Contact** - Get in touch

Just ask me anything! I'm here 24/7 to assist you.

⚠️ **Important:** Jendo supports early detection and preventive care but does not replace professional medical advice.`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the Jendo Chatbot API (Three-Tier System)
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          history: messages.slice(-5).map(m => ({ // Send last 5 messages for context
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(data.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Fallback response if API fails
      const fallbackMessage: Message = {
        role: 'assistant',
        content: `I apologize for the technical difficulty. Please contact our team directly:\n\n📞 Phone: 0766210120\n📧 Email: info@jendoinnovations.com\n🏢 Location: Bay 09, Trace Expert City, Colombo\n\nBusiness Hours: Mon-Fri 9 AM - 5 PM`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-40 rounded-full shadow-2xl",
          "bg-white border-2 border-purple-200",
          "hover:border-purple-400 hover:shadow-purple-200/50 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
          "bottom-16 right-16 sm:bottom-20 sm:right-20",
          "w-15 h-15 sm:w-18 sm:h-18", // Larger main button
          "flex items-center justify-center",
          "group hover:scale-105 transition-transform",
          isOpen && "hidden"
        )}
        aria-label="Open chat"
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20"> {/* Larger logo */}
          <Image
            src="https://i.ibb.co/cbTZ66m/OIP-8-removebg-preview.png"
            alt="JENDO Chat"
            fill
            className="object-contain p-0.5"
            priority
          />
        </div>
        <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"> {/* Smaller badge */}
          <MessageSquare className="h-2.5 w-2.5 sm:h-3 w-3 text-white" />
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-40 bottom-0 right-0 w-full sm:w-96 sm:bottom-6 sm:right-6 sm:max-w-[calc(100vw-3rem)]", // Adjusted for mobile
          "bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl",
          "transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full sm:translate-y-0 sm:scale-95 opacity-0 pointer-events-none"
        )}
        style={{ maxHeight: isOpen ? '90vh' : '0' }} // Prevent overflow on mobile
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-white" />
            <span className="font-semibold text-white">JENDO Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[50vh] sm:h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 shadow-sm"
                )}
              >
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {message.role === 'assistant' ? (
                    formatMessage(message.content)
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                {isMounted && (
                  <p className={cn(
                    "text-xs mt-2 opacity-70",
                    message.role === 'user' ? "text-white/80" : "text-gray-600"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-purple-500 text-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={cn(
                "p-2 rounded-full bg-purple-600 text-white",
                "hover:bg-purple-700 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}