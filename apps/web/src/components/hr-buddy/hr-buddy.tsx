'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Headphones, Bot, User, Sparkles, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QUICK_ACTIONS } from './hr-knowledge-base';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  streaming?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
        <Bot className="h-4 w-4 text-teal-700" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ModeBadge({ isAiMode }: { isAiMode: boolean | null }) {
  if (isAiMode === null) return null;
  return isAiMode ? (
    <span className="flex items-center gap-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
      <Sparkles className="h-2.5 w-2.5" />
      AI Powered
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
      <WifiOff className="h-2.5 w-2.5" />
      Offline Mode
    </span>
  );
}

export function HrBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content:
        "Hi! I'm HR Buddy, your virtual HR assistant. I can help you with queries about payroll, attendance, HRA, leave policies, claims, and more. Try asking a question or use the quick actions below!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isAiMode, setIsAiMode] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Check AI availability on mount
  useEffect(() => {
    fetch('/api/chat')
      .then((r) => r.json())
      .then((data) => setIsAiMode(!!data.aiEnabled))
      .catch(() => setIsAiMode(false));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: text.trim(),
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text.trim() }),
        });

        const contentType = response.headers.get('content-type') ?? '';

        if (contentType.includes('text/event-stream') && response.body) {
          // Streaming AI response
          const botMsgId = `bot-${Date.now()}`;
          setMessages((prev) => [
            ...prev,
            { id: botMsgId, content: '', sender: 'bot', timestamp: new Date(), streaming: true },
          ]);
          setIsTyping(false);

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content ?? '';
                if (delta) {
                  accumulated += delta;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMsgId ? { ...m, content: accumulated, streaming: true } : m
                    )
                  );
                  scrollToBottom();
                }
              } catch {
                // skip malformed SSE lines
              }
            }
          }

          // Mark streaming complete
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsgId ? { ...m, streaming: false } : m))
          );
        } else {
          // Offline / fallback JSON response
          const data = await response.json();
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            content: data.content ?? "I'm sorry, I couldn't process that request. Please try again.",
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        }
      } catch {
        const errorMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content:
            "I'm having trouble connecting right now. Please try again or contact HR directly via the Help Desk.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
        setIsAiMode(false);
      }
    },
    [isTyping, scrollToBottom]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const handleConnectHR = () => {
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      content:
        'I have initiated a request to connect you with an HR executive. A helpdesk ticket has been created and someone from the HR team will reach out to you within 2 working hours. You can also track the ticket status in HR Help Desk > My Tickets.',
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const lastBotMessage = [...messages].reverse().find((m) => m.sender === 'bot');
  const showFallback =
    messages.length > 1 &&
    lastBotMessage &&
    !lastBotMessage.streaming &&
    lastBotMessage.content.includes("I'm not sure");

  return (
    <>
      {/* Chat Panel */}
      <div
        className={cn(
          'fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[520px] max-h-[calc(100vh-8rem)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-teal-700" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">HR Buddy</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-teal-100 text-xs">Online | Ready to help</p>
                  <ModeBadge isAiMode={isAiMode} />
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'mb-4 flex',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center mr-2 mt-1">
                    <Bot className="h-4 w-4 text-teal-700" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div
                    className={cn(
                      'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    )}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <span className="inline-block w-1.5 h-3.5 bg-gray-500 ml-0.5 animate-pulse rounded-sm align-middle" />
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-[10px] text-gray-400 mt-1 px-1',
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    )}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center ml-2 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && <TypingIndicator />}

            {/* Connect to HR button when fallback shown */}
            {showFallback && !isTyping && (
              <div className="flex justify-center mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnectHR}
                  className="text-teal-700 border-teal-300 hover:bg-teal-50 gap-2 text-xs"
                >
                  <Headphones className="h-3.5 w-3.5" />
                  Connect to HR Executive
                </Button>
              </div>
            )}
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-t border-gray-100">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.query)}
                  disabled={isTyping}
                  className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded-full border border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="px-3 pb-3 pt-1 flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about HR..."
              className="flex-1 rounded-full border-gray-200 text-sm h-9 focus-visible:ring-teal-500"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full h-9 w-9 bg-teal-600 hover:bg-teal-700 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105',
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-teal-600 hover:bg-teal-700'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </>
        )}
      </button>
    </>
  );
}
