import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { ChatModule } from '../src/modules/chat/chat.module';
import { LlmModule } from '../src/modules/llm/llm.module';
import { ConversationModule } from '../src/modules/conversation/conversation.module';

// Mock the LlmService
jest.mock('../src/modules/llm/llm.service', () => {
  return {
    LlmService: jest.fn().mockImplementation(() => ({
      generateResponse: jest
        .fn()
        .mockResolvedValue('Hello, how can I help you?'),
    })),
  };
});

describe('Chat (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        ChatModule,
        LlmModule,
        ConversationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe('/chat (POST)', () => {
    it('should process a chat message', () => {
      return request(app.getHttpServer())
        .post('/chat')
        .send({
          message: 'Hello, how are you?',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('text');
          expect(res.body).toHaveProperty('conversationId');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('should validate message input', () => {
      return request(app.getHttpServer()).post('/chat').send({}).expect(400);
    });

    it('should reject messages that are too long', () => {
      const longMessage = 'a'.repeat(1001);

      return request(app.getHttpServer())
        .post('/chat')
        .send({ message: longMessage })
        .expect(400);
    });
  });

  describe('/chat/history/:conversationId (GET)', () => {
    it('should return 404 for non-existent conversation', () => {
      return request(app.getHttpServer())
        .get('/chat/history/non-existent-id')
        .expect(404);
    });
  });
});
