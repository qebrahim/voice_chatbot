export interface ChatRequest {
  message: string;
  conversationId?: string;
  timestamp?: Date;
}

export interface ChatResponse {
  text: string;
  conversationId: string;
  timestamp: Date;
}
