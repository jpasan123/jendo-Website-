'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m JENDO\'s AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulated response
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: getSimulatedResponse(inputMessage),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setIsLoading(false);
    }
  };

  const getSimulatedResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('price') || lowercaseInput.includes('cost')) {
      return 'Our JENDO devices start from $999 for the Basic Package. Would you like to know more about our pricing plans?';
    }
    
    if (lowercaseInput.includes('how does the jendo device') && lowercaseInput.includes('work')) {
      return 'JENDO uses advanced non-invasive technology to monitor vascular health. It combines PPG, DTM, and ECG measurements to provide comprehensive cardiovascular analysis in just 15 minutes.';
    }
    
    if (lowercaseInput.includes('contact') || lowercaseInput.includes('support')) {
      return 'You can reach our support team at info@jendoinnovations.com or call us at 0766210120. Would you like me to help you with anything specific?';
    }
    
    return 'I understand you\'re interested in JENDO. Could you please provide more details about your question so I can better assist you?';
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-40 p-4 rounded-full shadow-lg",
          "bg-purple-600 text-white",
          "hover:bg-purple-700 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
          "bottom-4 right-4 sm:bottom-6 sm:right-6", // Adjusted positioning for mobile
          "animate-bounce-slow",
          isOpen && "hidden"
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
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
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.role === 'user'
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
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