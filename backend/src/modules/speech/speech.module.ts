import { Module } from '@nestjs/common';
import { SpeechController } from './speech.controller';
import { SpeechService } from './speech.service';
import { ElevenlabsModule } from '../elevenlabs/elevenlabs.module';

@Module({
  imports: [ElevenlabsModule],
  controllers: [SpeechController],
  providers: [SpeechService],
  exports: [SpeechService],
})
export class SpeechModule {}