
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Loader2, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import axios from 'axios';
import type { ScrollArea as ScrollAreaPrimitive } from '@radix-ui/react-scroll-area';

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
          className="flex-1 bg-background/50 focus-visible:ring-primary"
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

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
    const constraintsRef = useRef(null);
    const isDraggingRef = useRef(false);

    const handleButtonClick = () => {
      if (!isDraggingRef.current) {
        onClick();
      }
    };

    return (
      <motion.div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
        <motion.div
          drag
          dragConstraints={constraintsRef}
          whileTap={{ scale: 0.9 }}
          onDragStart={() => { isDraggingRef.current = true; }}
          onDragEnd={() => {
            setTimeout(() => { isDraggingRef.current = false; }, 50);
          }}
          className="fixed bottom-20 right-6 z-50 pointer-events-auto md:bottom-6"
        >
          <Button
            onClick={handleButtonClick}
            className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-br from-primary to-accent text-primary-foreground"
            aria-label="Open chatbot"
          >
            <MessageCircle className="h-8 w-8" />
          </Button>
        </motion.div>
      </motion.div>
    );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, status, onSendMessage, onClose, chatWindowRef }) => {
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollAreaPrimitive> | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages]);
  
  return (
    <motion.div 
      ref={chatWindowRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-96 h-full sm:h-auto max-h-full sm:max-h-[80vh] flex flex-col glassmorphism rounded-t-lg sm:rounded-lg shadow-2xl shadow-primary/20 z-50 overflow-hidden"
    >
      <header className="flex justify-between items-center p-4 bg-primary/90 text-primary-foreground rounded-t-lg">
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

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
            {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary flex-shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div className="w-full max-w-[85%]">
                     <div
                      className={cn('p-3 rounded-xl shadow-md text-sm',
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card/80 text-card-foreground rounded-bl-none'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                     {msg.isSuggestionMessage && msg.suggestions && (
                      <div className="mt-2 space-y-2">
                        {msg.suggestions.map((suggestion, suggestionIndex) => (
                            <Button
                              key={suggestionIndex}
                              onClick={() => onSendMessage(suggestion)}
                              variant="outline"
                              className="w-full justify-start h-auto text-wrap py-2 border-primary/30 hover:bg-primary/10"
                              disabled={status === 'submitting'}
                            >
                              {suggestion}
                            </Button>
                          ))}
                      </div>
                    )}
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
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={onSendMessage} isSubmitting={status === 'submitting'} />
    </motion.div>
  );
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! How can I assist you today? Here are some things I can help with:", 
      sender: 'bot',
      isSuggestionMessage: true,
      suggestions: [
        "What services do you offer?",
        "What are your business hours?",
        "How do I contact support?",
        "What is the date today?"
      ]
    }
  ]);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    const messageToSend = text.trim();
    if (!messageToSend || status === 'submitting') return;

    const userMessage: Message = { text: messageToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setStatus('submitting');

    try {
      const response = await axios.post('/api/chat', { message: messageToSend });
      const botResponse: Message = { text: response.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      const botResponse: Message = { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setStatus('idle');
    }
  }, [status]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

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
