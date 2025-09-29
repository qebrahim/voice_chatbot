import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TextToSpeechDto {
  @ApiProperty({ example: 'Hello, how can I help you today?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  voiceId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  voiceSettings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}
