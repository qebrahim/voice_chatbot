import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationService],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateConversation', () => {
    it('should create a new conversation', async () => {
      const conversation = await service.getOrCreateConversation();

      expect(conversation).toBeDefined();
      expect(conversation.id).toBeDefined();
      expect(conversation.messages).toEqual([]);
      expect(conversation.createdAt).toBeInstanceOf(Date);
    });

    it('should return existing conversation', async () => {
      const conversation1 = await service.getOrCreateConversation();
      const conversation2 = await service.getOrCreateConversation(
        conversation1.id,
      );

      expect(conversation1.id).toBe(conversation2.id);
    });
  });

  describe('addMessage', () => {
    it('should add a message to conversation', async () => {
      const conversation = await service.getOrCreateConversation();
      const message = await service.addMessage(conversation.id, {
        role: 'user',
        content: 'Hello',
        timestamp: new Date(),
      });

      expect(message.id).toBeDefined();
      expect(message.role).toBe('user');
      expect(message.content).toBe('Hello');

      const updatedConversation = await service.getConversation(
        conversation.id,
      );
      expect(updatedConversation.messages).toHaveLength(1);
    });

    it('should throw error for non-existent conversation', async () => {
      await expect(
        service.addMessage('non-existent', {
          role: 'user',
          content: 'Hello',
          timestamp: new Date(),
        }),
      ).rejects.toThrow('Conversation not found');
    });
  });

  describe('cleanupOldConversations', () => {
    it('should cleanup old conversations', async () => {
      const conversation = await service.getOrCreateConversation();

      // Manually set old timestamp
      const oldConversation = await service.getConversation(conversation.id);
      oldConversation.lastActivity = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago

      const cleanedCount = service.cleanupOldConversations(24);

      expect(cleanedCount).toBe(1);
      const deletedConversation = await service.getConversation(
        conversation.id,
      );
      expect(deletedConversation).toBeNull();
    });
  });
});
