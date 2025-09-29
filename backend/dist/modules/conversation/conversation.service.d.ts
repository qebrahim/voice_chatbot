interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}
interface Conversation {
    id: string;
    messages: Message[];
    createdAt: Date;
    lastActivity: Date;
}
export declare class ConversationService {
    private readonly logger;
    private readonly conversations;
    getOrCreateConversation(conversationId?: string): Promise<Conversation>;
    getConversation(conversationId: string): Promise<Conversation | null>;
    addMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message>;
    deleteConversation(conversationId: string): Promise<boolean>;
    cleanupOldConversations(maxAgeHours?: number): number;
}
export {};
