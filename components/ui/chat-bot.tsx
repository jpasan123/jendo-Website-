'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Minimize2, Bot } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const font = 'var(--font-red-hat-display),sans-serif';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const formatMessage = (content: string) => {
  return content.split('\n').map((line, index) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = line.split(boldRegex);
    return (
      <p key={index} className="mb-1.5 last:mb-0">
        {parts.map((part, i) =>
          i % 2 === 1
            ? <strong key={i} className="font-semibold" style={{ color: '#5b21b6' }}>{part}</strong>
            : part
        )}
      </p>
    );
  });
};

const quickReplies = ['About Jendo', 'How it works', 'Book appointment', 'Contact us'];

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
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (!isOpen && messages.length > 1) setUnread(prev => prev + 0); }, [messages]);

  const open = () => { setIsOpen(true); setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); };
  const close = () => setIsOpen(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, timestamp: new Date(data.timestamp) }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize for the technical difficulty. Please contact our team directly:\n\n📞 Phone: 0766210120\n📧 Email: info@jendoinnovations.com\n🏢 Location: Bay 09, Trace Expert City, Colombo\n\nBusiness Hours: Mon-Fri 9 AM - 5 PM`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(inputMessage); };

  return (
    <>
      {/* FAB */}
      <button
        onClick={open}
        aria-label="Open chat"
        className={cn(
          'fixed z-40 bottom-6 right-6 sm:bottom-8 sm:right-8 group transition-all duration-300',
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        )}
      >
        {/* Pulse ring */}
        <span className="absolute inset-1 rounded-[50%_50%_50%_12%] animate-ping opacity-10" style={{ background: '#893A9F' }} />
        <div
          className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-95"
          style={{
            width: 60, height: 60,
            borderRadius: '50% 50% 50% 12%',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(137,58,159,0.35)',
            border: '1.5px solid #e9e0f5',
          }}
        >
          <Image src="/jendo-icon.png" alt="Jendo" width={50} height={50} className="object-contain" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: '#893A9F' }}>
              {unread}
            </span>
          )}
        </div>
        {/* Tooltip label */}
        <span
          className="absolute right-[70px] top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none"
          style={{ background: '#1a0a2e', color: '#fff', fontFamily: font, boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          Chat with JENDO
        </span>
      </button>

      {/* Chat window */}
      <div
        className={cn(
          'fixed z-50 flex flex-col',
          'bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-[400px]',
          'rounded-t-3xl sm:rounded-3xl overflow-hidden',
          'transition-all duration-300 ease-out',
          isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-8 opacity-0 pointer-events-none'
        )}
        style={{
          maxHeight: '90vh',
          fontFamily: font,
          boxShadow: '0 32px 80px rgba(45,10,62,0.28), 0 8px 24px rgba(137,58,159,0.18)',
        }}
      >

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1e0533 0%,#3a0d55 50%,#6b1e8f 100%)' }}>
          {/* Top accent bar */}
          <div className="h-0.5 w-full" style={{ background: 'linear-gradient(to right,transparent,#c084fc,transparent)' }} />

          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            {/* Left: avatar + info */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {/* White background for icon — as requested */}
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  <Image src="/jendo-icon.png" alt="Jendo" width={36} height={36} className="object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full" style={{ background: '#22c55e', border: '2px solid #1e0533' }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight tracking-wide">JENDO Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                  <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Online · AI Health Intelligence</span>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1.5">
              {/* <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Sparkles className="w-3 h-3" style={{ color: '#c084fc' }} />
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>AI</span>
              </div> */}
              <button
                onClick={close}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-5 space-y-5"
          style={{ background: '#f5f3fa', minHeight: 0, maxHeight: '46vh' }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-xl mt-0.5 flex items-center justify-center"
                  style={{ background: '#fff', boxShadow: '0 1px 4px rgba(137,58,159,0.15)', border: '1px solid #ede8f5' }}
                >
                  <Image src="/jendo-icon.png" alt="J" width={22} height={22} className="object-contain" />
                </div>
              )}
              <div className="max-w-[80%] flex flex-col gap-1">
                {msg.role === 'assistant' && (
                  <p className="text-[10px] font-semibold px-1" style={{ color: '#893A9F' }}>JENDO Assistant</p>
                )}
                <div
                  className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg,#4a1260,#893A9F)',
                        color: '#fff',
                        borderBottomRightRadius: 4,
                        boxShadow: '0 4px 12px rgba(137,58,159,0.3)',
                      }
                    : {
                        background: '#fff',
                        color: '#1f2937',
                        border: '1px solid #e9e0f5',
                        borderBottomLeftRadius: 4,
                        boxShadow: '0 2px 8px rgba(137,58,159,0.06)',
                      }
                  }
                >
                  {msg.role === 'assistant' ? formatMessage(msg.content) : <p>{msg.content}</p>}
                </div>
                {isMounted && (
                  <p className="text-[10px] px-1" style={{ color: '#a78bca', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-xl mt-0.5 flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)', boxShadow: '0 2px 8px rgba(137,58,159,0.25)' }}>
                  You
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: '#fff', border: '1px solid #e9e0f5', boxShadow: '0 1px 4px rgba(137,58,159,0.1)' }}>
                <Image src="/jendo-icon.png" alt="J" width={22} height={22} className="object-contain" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-[4px]"
                style={{ background: '#fff', border: '1px solid #e9e0f5', boxShadow: '0 2px 8px rgba(137,58,159,0.06)' }}>
                <div className="flex items-center gap-1.5">
                  {[0, 150, 300].map((d) => (
                    <div key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#c084fc', animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 1 && (
          <div className="flex-shrink-0 px-4 py-3 flex gap-2 flex-wrap" style={{ background: '#f5f3fa', borderTop: '1px solid #e9e0f5' }}>
            <p className="w-full text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#a78bca' }}>Suggested</p>
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => sendMessage(qr)}
                className="text-xs px-3.5 py-1.5 rounded-full font-medium transition-all"
                style={{ background: '#fff', color: '#893A9F', border: '1px solid #d8c8ed' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#893A9F';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = '#893A9F';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#fff';
                  (e.currentTarget as HTMLElement).style.color = '#893A9F';
                  (e.currentTarget as HTMLElement).style.borderColor = '#d8c8ed';
                }}
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ background: '#fff', borderTop: '1px solid #e9e0f5' }}>
          <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{ background: '#f5f3fa', border: '1.5px solid #e2d8f0' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Message JENDO Assistant…"
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                style={{ fontFamily: font, color: '#1f2937' }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
              style={{
                background: inputMessage.trim() ? 'linear-gradient(135deg,#4a1260,#893A9F)' : '#ede8f5',
                boxShadow: inputMessage.trim() ? '0 4px 12px rgba(137,58,159,0.35)' : 'none',
              }}
              aria-label="Send"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: inputMessage.trim() ? '#fff' : '#9ca3af' }} />
                : <Send className="w-4 h-4" style={{ color: inputMessage.trim() ? '#fff' : '#9ca3af' }} />
              }
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 pb-3">
            <Bot className="w-3 h-3" style={{ color: '#c084fc' }} />
            <p className="text-[10px] font-medium" style={{ color: '#a78bca', fontFamily: font }}>
              Powered by <span className="font-bold" style={{ color: '#893A9F' }}>JENDO AI</span>
              <span style={{ color: '#d1c7e8' }}>&nbsp;·&nbsp;</span>
              <span>Not a substitute for medical advice</span>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}