"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const throttler_1 = require("@nestjs/throttler");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const chat_module_1 = require("./modules/chat/chat.module");
const speech_module_1 = require("./modules/speech/speech.module");
const llm_module_1 = require("./modules/llm/llm.module");
const elevenlabs_module_1 = require("./modules/elevenlabs/elevenlabs.module");
const conversation_module_1 = require("./modules/conversation/conversation.module");
const health_controller_1 = require("./common/controllers/health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            nest_winston_1.WinstonModule.forRoot({
                level: process.env.LOG_LEVEL || 'info',
                format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
                defaultMeta: { service: 'voice-chatbot' },
                transports: [
                    new winston.transports.File({
                        filename: 'logs/error.log',
                        level: 'error'
                    }),
                    new winston.transports.File({
                        filename: 'logs/combined.log'
                    }),
                    ...(process.env.NODE_ENV !== 'production'
                        ? [new winston.transports.Console({
                                format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
                            })]
                        : []),
                ],
            }),
            chat_module_1.ChatModule,
            speech_module_1.SpeechModule,
            llm_module_1.LlmModule,
            elevenlabs_module_1.ElevenlabsModule,
            conversation_module_1.ConversationModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map