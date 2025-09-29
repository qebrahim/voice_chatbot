export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export interface CreateMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}
