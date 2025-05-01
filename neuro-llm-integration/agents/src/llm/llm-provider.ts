import { HfInference } from '@huggingface/inference';
import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { XAI } from '@xai-ai/sdk';

export interface LLMConfig {
    provider: 'huggingface' | 'openai' | 'anthropic' | 'xai';
    model: string;
    apiKey: string;
    parameters?: {
        maxTokens?: number;
        temperature?: number;
        topP?: number;
    };
}

export interface LLMResponse {
    success: boolean;
    text?: string;
    error?: string;
    model: string;
    provider: string;
}

export class LLMProvider {
    private hf: HfInference;
    private openai: OpenAI;
    private anthropic: Anthropic;
    private xai: XAI;
    private config: LLMConfig;

    constructor(config: LLMConfig) {
        this.config = config;
        
        switch (config.provider) {
            case 'huggingface':
                this.hf = new HfInference(config.apiKey);
                break;
            case 'openai':
                this.openai = new OpenAI({ apiKey: config.apiKey });
                break;
            case 'anthropic':
                this.anthropic = new Anthropic({ apiKey: config.apiKey });
                break;
            case 'xai':
                this.xai = new XAI({ apiKey: config.apiKey });
                break;
        }
    }

    async generateText(prompt: string): Promise<LLMResponse> {
        try {
            let response: string;

            switch (this.config.provider) {
                case 'huggingface':
                    const hfResponse = await this.hf.textGeneration({
                        model: this.config.model,
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: this.config.parameters?.maxTokens || 100,
                            temperature: this.config.parameters?.temperature || 0.7,
                            top_p: this.config.parameters?.topP || 0.9
                        }
                    });
                    response = hfResponse.generated_text;
                    break;

                case 'openai':
                    const openaiResponse = await this.openai.chat.completions.create({
                        model: this.config.model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: this.config.parameters?.maxTokens,
                        temperature: this.config.parameters?.temperature,
                        top_p: this.config.parameters?.topP
                    });
                    response = openaiResponse.choices[0].message.content;
                    break;

                case 'anthropic':
                    const anthropicResponse = await this.anthropic.messages.create({
                        model: this.config.model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: this.config.parameters?.maxTokens,
                        temperature: this.config.parameters?.temperature,
                        top_p: this.config.parameters?.topP
                    });
                    response = anthropicResponse.content[0].text;
                    break;

                case 'xai':
                    const xaiResponse = await this.xai.chat.completions.create({
                        model: this.config.model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: this.config.parameters?.maxTokens,
                        temperature: this.config.parameters?.temperature,
                        top_p: this.config.parameters?.topP
                    });
                    response = xaiResponse.choices[0].message.content;
                    break;

                default:
                    throw new Error('Unsupported LLM provider');
            }

            return {
                success: true,
                text: response,
                model: this.config.model,
                provider: this.config.provider
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                model: this.config.model,
                provider: this.config.provider
            };
        }
    }
} 