declare const _default: () => {
    port: number;
    nodeEnv: string;
    corsOrigin: string;
    openai: {
        apiKey: string;
        model: string;
    };
    gemini: {
        apiKey: string;
        model: string;
    };
    elevenlabs: {
        apiKey: string;
        voiceId: string;
    };
    rateLimit: {
        ttl: number;
        limit: number;
    };
};
export default _default;
