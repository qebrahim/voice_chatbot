export const mockConversation = {
  id: 'test-conversation-id',
  messages: [
    {
      id: 'msg-1',
      role: 'user' as const,
      content: 'Hello',
      timestamp: new Date('2023-01-01T00:00:00Z'),
    },
    {
      id: 'msg-2',
      role: 'assistant' as const,
      content: 'Hello! How can I help you?',
      timestamp: new Date('2023-01-01T00:00:01Z'),
    },
  ],
  createdAt: new Date('2023-01-01T00:00:00Z'),
  lastActivity: new Date('2023-01-01T00:00:01Z'),
};

export const mockChatMessage = {
  message: 'Test message',
  conversationId: 'test-conversation-id',
};
