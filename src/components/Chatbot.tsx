'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

// Message interface
interface Message {
  text?: string;
  sender?: 'user' | 'bot';
  type?: 'faq_suggestions';
  suggestions?: string[];
}

// Props for ChatInput
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSubmitting: boolean;
}

// ChatInput Component
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSubmitting }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-transparent">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-background/50"
          placeholder="Type your message..."
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSubmitting || !inputValue.trim()}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

// small mapping for common cities -> IANA timezones
const cityTimeZones: Record<string, string> = {
  kolkata: 'Asia/Kolkata',
  india: 'Asia/Kolkata',
  mumbai: 'Asia/Kolkata',
  delhi: 'Asia/Kolkata',
  bangalore: 'Asia/Kolkata',
  london: 'Europe/London',
  'new york': 'America/New_York',
  nyc: 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  la: 'America/Los_Angeles',
  chicago: 'America/Chicago',
  tokyo: 'Asia/Tokyo',
  sydney: 'Australia/Sydney',
};

// try to extract a timezone (IANA) or a city from the user's text
const extractTimezoneFromMessage = (text: string): string | undefined => {
  // check "in {place}" patterns
  const inMatch = text.match(/in\s+([A-Za-z\/_\s]+)/i);
  if (inMatch) {
    const place = inMatch[1].trim().toLowerCase();
    for (const key of Object.keys(cityTimeZones)) {
      if (place.includes(key)) return cityTimeZones[key];
    }
  }

  // check for IANA timezone-like token (e.g., "Asia/Kolkata")
  const ianaMatch = text.match(/\b([A-Za-z]+\/[A-Za-z_]+)\b/);
  if (ianaMatch) {
    return ianaMatch[1];
  }

  // common abbreviations
  const abbrMatch = text.match(/\b(UTC|GMT|IST|PST|EST|CET|EET|BST)\b/i);
  if (abbrMatch) {
    const a = abbrMatch[1].toUpperCase();
    if (a === 'IST') return 'Asia/Kolkata';
    if (a === 'PST') return 'America/Los_Angeles';
    if (a === 'EST') return 'America/New_York';
    if (a === 'GMT' || a === 'UTC') return 'UTC';
    if (a === 'CET') return 'Europe/Paris';
    if (a === 'BST') return 'Europe/London';
  }

  return undefined;
};

// format time string (safe fallback included)
const formatTime = (timeZone?: string): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  try {
    if (timeZone) {
      // may throw if the timezone string is invalid in some environments
      return new Intl.DateTimeFormat('en-GB', { ...options, timeZone }).format(now);
    }
    return new Intl.DateTimeFormat('en-GB', options).format(now);
  } catch (e) {
    // fallback to browser's locale/time
    return now.toLocaleString();
  }
};

// Main Chatbot Component
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today? Here are some things I can help with:", sender: 'bot' },
    {
      type: 'faq_suggestions',
      suggestions: [
        "What services do you offer?",
        "What are your business hours?",
        "How do I contact support?",
        "How can I book a meeting?"
      ]
    }
  ]);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    const messageToSend = text.trim();
    if (!messageToSend || status === 'submitting') return;

    const userMessage: Message = { text: messageToSend, sender: 'user' };

    const timeQueryRegex = /\b(what(?:'s| is)? the time|what time is it|current time|time now|time in)\b/i;
    if (timeQueryRegex.test(messageToSend)) {
      const tz = extractTimezoneFromMessage(messageToSend);
      const defaultTz = 'Asia/Kolkata';
      const usedTz = tz ?? defaultTz;
      const timeStr = formatTime(usedTz);
      const botReply = tz
        ? `The current time in ${usedTz} is ${timeStr}.`
        : `The current time (Asia/Kolkata) is ${timeStr}.`;

      const botResponse: Message = { text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, userMessage, botResponse]);
      return;
    }

    setMessages(prev => [...prev, userMessage]);
    setStatus('submitting');

    try {
      // This is a placeholder. In a real app, you would have a Genkit flow here.
      // const response = await callYourGenkitFlow({ message: messageToSend });
      // const botResponse: Message = { text: response.reply, sender: 'bot' };
      
      // Simulating network delay and falling back to canned responses
      await new Promise(res => setTimeout(res, 1000));
      throw new Error("Simulating backend failure to show fallback logic.");

    } catch (error) {
      console.error("Chatbot API error:", error);

      let botReply = "Sorry, I'm having trouble connecting right now. Please try again later.";
      const lowerMessage = messageToSend.toLowerCase();
      if (lowerMessage.includes('service') || lowerMessage.includes('what do you offer')) {
        botReply = "We offer web development, mobile app development, AI solutions, and digital transformation services. Would you like to know more about any specific service?";
      } else if (lowerMessage.includes('hours') || lowerMessage.includes('time')) {
        botReply = "Our business hours are Monday to Sunday, 9:00 AM - 8:00 PM. We're available to help you during these times!";
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
        botReply = "You can reach us at contact@digitalindian.co.in or call us at +91 98765 43210. We're here to help!";
      } else if (lowerMessage.includes('meeting') || lowerMessage.includes('book')) {
        botReply = "To book a meeting, please contact us directly at contact@digitalindian.co.in. We'll be happy to schedule a consultation!";
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        botReply = "Hello! I'm here to help you with any questions about our services. What would you like to know?";
      }

      const botResponse: Message = { text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setStatus('idle');
    }
  }, [status]);

  const ChatbotButton: React.FC = () => (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
      aria-label="Open chatbot"
    >
      <MessageCircle className="h-8 w-8" />
    </Button>
  );

  const ChatWindow: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-96 h-full sm:h-auto max-h-full sm:max-h-[80vh] flex flex-col glassmorphism rounded-t-lg sm:rounded-lg shadow-2xl shadow-primary/20 z-50 overflow-hidden"
    >
      <header className="flex justify-between items-center p-4 bg-primary/90 text-primary-foreground rounded-t-lg">
        <h3 className="font-headline text-lg">Digital Indian Assistant</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 rounded-full"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
            {messages.map((msg, index) => (
              msg.type === 'faq_suggestions' ? (
                <div key={index} className="flex justify-start">
                  <div className="max-w-[85%] space-y-2">
                    <div className="p-3 rounded-xl bg-card/80 text-card-foreground rounded-bl-none">
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.suggestions?.map((suggestion, suggestionIndex) => (
                        <Button
                          key={suggestionIndex}
                          onClick={() => handleSendMessage(suggestion)}
                          variant="outline"
                          className="w-full justify-start h-auto text-wrap py-2"
                          disabled={status === 'submitting'}
                        >
                          {suggestion}
                        </Button>
                      ))}
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn('max-w-[85%] p-3 rounded-xl shadow-md text-sm',
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card/80 text-card-foreground rounded-bl-none'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            ))}
            {status === 'submitting' && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-3 rounded-xl shadow-md bg-card/80 text-card-foreground rounded-bl-none flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={handleSendMessage} isSubmitting={status === 'submitting'} />
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen ? <ChatWindow /> : <ChatbotButton />}
    </AnimatePresence>
  );
};

export default Chatbot;
