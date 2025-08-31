'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Loader2, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import axios from 'axios';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  isSuggestionMessage?: boolean;
  suggestions?: string[];
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSubmitting: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  status: 'idle' | 'submitting';
  onSendMessage: (text: string) => void;
  onClose: () => void;
  chatWindowRef: React.RefObject<HTMLDivElement>;
}

interface ChatbotButtonProps {
  onClick: () => void;
}

/* =======================
   Chat Input
   ======================= */
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSubmitting }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSendMessage(trimmed);
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
          className="flex-1 bg-background/50 focus-visible:ring-primary"
          placeholder="Type your message..."
          disabled={isSubmitting}
          aria-label="Message input"
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

/* =======================
   Floating Button
   ======================= */
const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const handleButtonClick = () => {
    if (!isDraggingRef.current) onClick();
  };

  return (
    <motion.div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        whileTap={{ scale: 0.9 }}
        onDragStart={() => { isDraggingRef.current = true; }}
        onDragEnd={() => { setTimeout(() => (isDraggingRef.current = false), 50); }}
        className="fixed bottom-20 right-6 pointer-events-auto md:bottom-6"
      >
        <Button
          onClick={handleButtonClick}
          className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-br from-primary to-accent text-primary-foreground"
          aria-label="Open chat"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

/* =======================
   Chat Window
   ======================= */
/* =======================
   Chat Window
   ======================= */
   const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    status,
    onSendMessage,
    onClose,
    chatWindowRef,
  }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
  
    // Auto-scroll to the newest message
    useEffect(() => {
      const id = requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
      return () => cancelAnimationFrame(id);
    }, [messages, status]);
  
    return (
      <motion.div
        ref={chatWindowRef}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          // On mobile → full width, full height
          'fixed bottom-0 right-0 w-full h-full rounded-none',
          // On desktop → float at bottom-right, fixed size
          'sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] sm:rounded-lg',
          'flex flex-col shadow-2xl z-50 overflow-hidden glassmorphism'
        )}
        role="dialog"
        aria-label="Digital Indian Assistant"
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-primary/90 text-primary-foreground">
          <h3 className="font-headline text-lg">Digital Indian Assistant</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-white/20"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>
  
        {/* Messages */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-end gap-2',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary flex-shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div className="w-full max-w-[85%]">
                    <div
                      className={cn(
                        'p-3 rounded-xl shadow-md text-sm',
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card/80 text-card-foreground rounded-bl-none'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
  
                    {msg.isSuggestionMessage && msg.suggestions?.length ? (
                      <div className="mt-2 space-y-2">
                        {msg.suggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            onClick={() => onSendMessage(suggestion)}
                            variant="outline"
                            className="w-full justify-start h-auto text-wrap py-2 border-primary/30 hover:bg-primary/10"
                            disabled={status === 'submitting'}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
  
              {status === 'submitting' && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="max-w-[70%] p-3 rounded-xl shadow-md bg-card/80 text-card-foreground rounded-bl-none flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
  
              {/* Sentinel for auto-scroll */}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>
  
        {/* Input */}
        <ChatInput
          onSendMessage={onSendMessage}
          isSubmitting={status === 'submitting'}
        />
      </motion.div>
    );
  };
  

/* =======================
   Chatbot Wrapper
   ======================= */
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text:
        "Hello! How can I assist you today? Here are some things I can help with:",
      sender: 'bot',
      isSuggestionMessage: true,
      suggestions: [
        'What services do you offer?',
        'What are your business hours?',
        'How do I contact support?',
        'What is the date today?',
      ],
    },
  ]);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      const messageToSend = text.trim();
      if (!messageToSend || status === 'submitting') return;

      const userMessage: Message = { text: messageToSend, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);
      setStatus('submitting');

      try {
        const response = await axios.post('/api/chat', { message: messageToSend });
        const reply = response?.data?.reply ?? "Sorry, I couldn't process that.";
        const botResponse: Message = { text: reply, sender: 'bot' };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error('Chatbot API error:', error);
        const botResponse: Message = {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botResponse]);
      } finally {
        setStatus('idle');
      }
    },
    [status]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <ChatWindow
          messages={messages}
          status={status}
          onSendMessage={handleSendMessage}
          onClose={() => setIsOpen(false)}
          chatWindowRef={chatWindowRef}
        />
      ) : (
        <ChatbotButton onClick={() => setIsOpen(true)} />
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
