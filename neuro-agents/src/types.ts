import { NeuralContext, NeuralSignal } from '@neuro-mcp/server';

export type AgentType = 'sensory' | 'processing' | 'memory' | 'motor' | 'regulatory';

export interface NeuralAgentConfig {
    agentType: AgentType;
    neuralCapacity: number;
    learningRate: number;
    contextSensitivity: number;
    memoryCapacity: number;
    securityLevel: 'basic' | 'advanced' | 'quantum';
}

export interface LearningRule {
    type: string;
    parameters: Record<string, any>;
    context: NeuralContext;
}

export interface MemoryCell {
    id: string;
    data: Buffer;
    context: NeuralContext;
    lastAccessed: number;
    accessCount: number;
}

export interface AgentState {
    isActive: boolean;
    lastProcessedSignal: NeuralSignal | null;
    currentContext: NeuralContext | null;
    memoryUsage: number;
    processingLoad: number;
}

export interface AgentMetrics {
    signalsProcessed: number;
    memoryOperations: number;
    learningOperations: number;
    averageProcessingTime: number;
    errorRate: number;
} 