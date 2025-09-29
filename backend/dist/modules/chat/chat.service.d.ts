import { LlmService } from '../llm/llm.service';
import { ConversationService } from '../conversation/conversation.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { Conversation } from '../../shared/interfaces';
export declare class ChatService {
    private readonly llmService;
    private readonly conversationService;
    private readonly logger;
    constructor(llmService: LlmService, conversationService: ConversationService);
    processMessage(chatMessageDto: ChatMessageDto): Promise<ChatResponseDto>;
    getConversationHistory(conversationId: string): Promise<Conversation | null>;
}
