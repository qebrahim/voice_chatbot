import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from '../src/modules/chat/chat.module';

// Mock the LlmService to avoid real network calls
jest.mock('../src/modules/llm/llm.service', () => {
  return {
    LlmService: jest.fn().mockImplementation(() => ({
      generateResponse: jest.fn().mockResolvedValue('ok'),
    })),
  };
});

describe('Chat rate limiting (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Provide a global throttler; ChatController also sets @Throttle(20/min)
        ThrottlerModule.forRoot([
          {
            ttl: 60_000,
            limit: 100, // global default; route-level decorator is 20/min
          },
        ]),
        ConfigModule.forRoot({ isGlobal: true }),
        ChatModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should eventually return 429 when exceeding the per-route throttle limit', async () => {
    const server = app.getHttpServer();

    // The ChatController has @Throttle({ default: { limit: 20, ttl: 60000 } })
    // Send >20 requests quickly to trigger 429 from the ThrottlerGuard
    const attempts = 25;
    let got429 = false;

    for (let i = 0; i < attempts; i++) {
      const res = await request(server)
        .post('/chat')
        .send({ message: `msg ${i}` });
      if (res.status === 429) {
        got429 = true;
        break;
      }
    }

    expect(got429).toBe(true);
  });
});
