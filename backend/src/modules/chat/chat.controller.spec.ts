/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.Controller';
import { ChatService } from './chat.service';
import { NotFoundException } from '@nestjs/common';

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  const mockChatService = {
    processMessage: jest.fn(),
    getConversationHistory: jest.fn(),
  } as unknown as jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: mockChatService }],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should delegate to ChatService.processMessage and return response', async () => {
      const dto = { message: 'Hello', conversationId: undefined } as any;
      const response = {
        text: 'Hi there',
        conversationId: 'conv-1',
        timestamp: new Date(),
      };
      chatService.processMessage.mockResolvedValue(response as any);

      const result = await controller.sendMessage(dto);

      expect(chatService.processMessage).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('getConversationHistory', () => {
    it('should return conversation when found', async () => {
      const conv = {
        id: 'conv-1',
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date(),
      } as any;
      chatService.getConversationHistory.mockResolvedValue(conv);

      const result = await controller.getConversationHistory('conv-1');
      expect(chatService.getConversationHistory).toHaveBeenCalledWith('conv-1');
      expect(result).toBe(conv);
    });

    it('should propagate NotFoundException', async () => {
      chatService.getConversationHistory.mockRejectedValue(
        new NotFoundException('Conversation not found'),
      );

      await expect(
        controller.getConversationHistory('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
