import { 
  Controller, 
  Post, 
  Body, 
  UseInterceptors, 
  UploadedFile,
  Get,
  HttpCode,
  HttpStatus,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';

import { SpeechService } from './speech.service';
import { TextToSpeechDto } from './dto/text-to-speech.dto';

@ApiTags('speech')
@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Generate speech from text' })
  async generateSpeech(
    @Body() textToSpeechDto: TextToSpeechDto,
    @Res() res: Response,
  ) {
    const audioBuffer = await this.speechService.generateSpeech(
      textToSpeechDto.text,
      textToSpeechDto,
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    });

    res.send(audioBuffer);
  }

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Transcribe audio to text' })
  async transcribeAudio(@UploadedFile() file: Express.Multer.File) {
    return this.speechService.transcribeAudio(file.buffer);
  }

  @Get('voices')
  @ApiOperation({ summary: 'Get available voices' })
  async getVoices() {
    return this.speechService.getAvailableVoices();
  }
}