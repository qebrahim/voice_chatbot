import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  conversationId: string;

  @ApiProperty()
  timestamp: Date;
}