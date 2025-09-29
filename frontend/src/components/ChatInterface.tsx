import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { formatTimestamp } from '../utils/helpers';
import { MessageSquare, Bot, User } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isProcessing: boolean;
  conversationId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isProcessing,
  conversationId 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <MessageSquare size={20} />
        <span>Conversation</span>
        {conversationId && (
          <span className="conversation-id">ID: {conversationId.slice(0, 8)}...</span>
        )}
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}-message`}
          >
            <div className="message-avatar">
              {message.sender === 'user' ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>
            <div className="message-content">
              <p>{message.text}</p>
              <small className="timestamp">
                {formatTimestamp(message.timestamp)}
              </small>
            </div>
          </div>
        ))}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="message ai-message processing">
            <div className="message-avatar">
              <Bot size={16} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatInterface;