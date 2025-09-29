export declare class TextToSpeechDto {
    text: string;
    voiceId?: string;
    model?: string;
    voiceSettings?: {
        stability?: number;
        similarity_boost?: number;
        style?: number;
        use_speaker_boost?: boolean;
    };
}
