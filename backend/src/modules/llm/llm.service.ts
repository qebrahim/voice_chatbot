import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly geminiClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.geminiClient = axios.create({
      baseURL: 'https://generativelanguage.googleapis.com/v1',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
      params: {
        key: this.configService.get('gemini.apiKey'),
      },
    });
  }

  async generateResponse(
    userMessage: string,
    conversation: any = null,
  ): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: this.getSystemPrompt(),
      },
    ];

    // Add conversation history
    if (conversation?.messages) {
      const recentMessages = conversation.messages.slice(-10);
      messages.push(...recentMessages);
    }

    // Add current message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      // Build Gemini generateContent payload
      const model =
        this.configService.get<string>('gemini.model') || 'gemini-1.5-flash';

      // Map conversation history to Gemini format (last ~10 messages)
      const historyContents: Array<{
        role: string;
        parts: { text: string }[];
      }> = [];
      // Prepend system prompt as a user instruction to avoid system_instruction field compatibility issues
      historyContents.push({
        role: 'user',
        parts: [{ text: this.getSystemPrompt() }],
      });
      if (conversation?.messages) {
        const recentMessages = conversation.messages.slice(-10);
        for (const msg of recentMessages) {
          const role = msg.role === 'assistant' ? 'model' : 'user';
          historyContents.push({ role, parts: [{ text: msg.content }] });
        }
      }

      // Current user message
      const userContent = { role: 'user', parts: [{ text: userMessage }] };

      const payload = {
        contents: [...historyContents, userContent],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      };

      // Safe debug: log payload shape without sensitive headers
      try {
        const preview = JSON.stringify(
          {
            model,
            contentsCount: payload.contents.length,
            firstContentSample: payload.contents[0]?.parts?.[0]?.text?.slice(
              0,
              80,
            ),
            lastContentSample: payload.contents[
              payload.contents.length - 1
            ]?.parts?.[0]?.text?.slice(0, 80),
            generationConfig: payload.generationConfig,
          },
          null,
          2,
        );
        this.logger.debug(`Gemini request preview: ${preview}`);
      } catch {}

      const response = await this.geminiClient.post(
        `/models/${model}:generateContent`,
        payload,
      );

      const candidate = response.data?.candidates?.[0];
      const aiResponse: string =
        candidate?.content?.parts?.[0]?.text?.trim?.() || '';

      if (!aiResponse) {
        throw new Error('Empty response from Gemini');
      }

      this.logger.log(`Generated response: ${aiResponse.substring(0, 50)}...`);
      return aiResponse;
    } catch (error: any) {
      // Sanitize and surface a useful error without leaking secrets
      if (error?.response) {
        const status = error.response.status;
        const apiMessage =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          'LLM request failed';
        this.logger.error(`LLM generation error (${status}): ${apiMessage}`);
        throw new Error(apiMessage);
      }
      const message = error?.message || 'LLM request failed';
      this.logger.error(`LLM generation error: ${message}`);
      throw new Error(message);
    }
  }

  private getSystemPrompt(): string {
    return `You are a helpful voice assistant. Keep responses conversational and concise for voice interaction.`;
  }
}
