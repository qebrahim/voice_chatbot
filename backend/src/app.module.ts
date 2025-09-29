import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { Throttle, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ChatModule } from './modules/chat/chat.module';
import { SpeechModule } from './modules/speech/speech.module';
import { LlmModule } from './modules/llm/llm.module';
import { ElevenlabsModule } from './modules/elevenlabs/elevenlabs.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { HealthController } from './common/controllers/health.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // requests per TTL
    }]),
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'voice-chatbot' },
      transports: [
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log' 
        }),
        ...(process.env.NODE_ENV !== 'production' 
          ? [new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            })] 
          : []
        ),
      ],
    }),
    ChatModule,
    SpeechModule,
    LlmModule,
    ElevenlabsModule,
    ConversationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}