import { NeuralAgentConfig, AgentState, AgentMetrics } from './types';
import { NeuralNetwork, NeuralContext, NeuralSignal } from '@neuro-mcp/server';

export abstract class NeuralAgent {
    protected config: NeuralAgentConfig;
    protected network: NeuralNetwork;
    protected state: AgentState;
    protected metrics: AgentMetrics;

    constructor(config: NeuralAgentConfig) {
        this.config = config;
        this.network = new NeuralNetwork();
        this.state = {
            isActive: false,
            lastProcessedSignal: null,
            currentContext: null,
            memoryUsage: 0,
            processingLoad: 0
        };
        this.metrics = {
            signalsProcessed: 0,
            memoryOperations: 0,
            learningOperations: 0,
            averageProcessingTime: 0,
            errorRate: 0
        };
    }

    public async start(): Promise<void> {
        await this.initializeNeuralNetwork();
        await this.setupLearningMechanism();
        await this.configureMemorySystem();
        this.state.isActive = true;
    }

    public async stop(): Promise<void> {
        this.state.isActive = false;
        await this.cleanup();
    }

    public async processSignal(signal: NeuralSignal): Promise<void> {
        if (!this.state.isActive) {
            throw new Error('Agent is not active');
        }

        const startTime = Date.now();
        try {
            await this.preprocessSignal(signal);
            await this.activateNeurons(signal);
            await this.propagateSignal(signal);
            
            this.state.lastProcessedSignal = signal;
            this.metrics.signalsProcessed++;
            
            const processingTime = Date.now() - startTime;
            this.metrics.averageProcessingTime = 
                (this.metrics.averageProcessingTime * (this.metrics.signalsProcessed - 1) + processingTime) / 
                this.metrics.signalsProcessed;
        } catch (error) {
            this.metrics.errorRate = 
                (this.metrics.errorRate * (this.metrics.signalsProcessed - 1) + 1) / 
                this.metrics.signalsProcessed;
            throw error;
        }
    }

    public getState(): AgentState {
        return { ...this.state };
    }

    public getMetrics(): AgentMetrics {
        return { ...this.metrics };
    }

    protected abstract initializeNeuralNetwork(): Promise<void>;
    protected abstract setupLearningMechanism(): Promise<void>;
    protected abstract configureMemorySystem(): Promise<void>;
    protected abstract preprocessSignal(signal: NeuralSignal): Promise<void>;
    protected abstract activateNeurons(signal: NeuralSignal): Promise<void>;
    protected abstract propagateSignal(signal: NeuralSignal): Promise<void>;
    protected abstract cleanup(): Promise<void>;
} 