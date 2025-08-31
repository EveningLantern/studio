'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import axios from 'axios';

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
        "What is the date today?"
      ]
    }
  ]);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
              top: scrollAreaRef.current.scrollHeight,
              behavior: 'smooth'
          });
      }
  }, [messages]);

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

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
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
