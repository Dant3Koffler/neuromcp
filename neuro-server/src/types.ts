import { PublicKey } from '@solana/web3.js';

export interface NeuralSignal {
    source: string;
    target: string;
    data: Buffer;
    context: NeuralContext;
    timestamp: number;
    signature?: Buffer;
}

export interface NeuralContext {
    type: string;
    parameters: Record<string, any>;
    priority: number;
    expiration: number;
}

export interface NeuralNetworkConfig {
    networkType: NetworkType;
    learningRate: number;
    memoryCapacity: number;
    contextSensitivity: number;
}

export interface NeuronConfig {
    processingPower: number;
    memoryCapacity: number;
    contextSensitivity: number;
}

export enum NeuronType {
    Sensory = 'sensory',
    Interneuron = 'interneuron',
    Motor = 'motor',
    Memory = 'memory',
    Regulatory = 'regulatory'
}

export enum NetworkType {
    Feedforward = 'feedforward',
    Recurrent = 'recurrent',
    Convolutional = 'convolutional',
    Transformer = 'transformer',
    Spiking = 'spiking'
}

export interface SynapticConnection {
    sourceNode: PublicKey;
    targetNode: PublicKey;
    weight: number;
    context: NeuralContext;
    lastActivated: number;
}

export interface MemoryCell {
    id: string;
    data: Buffer;
    context: NeuralContext;
    lastAccessed: number;
    accessCount: number;
}

export interface AccessPattern {
    id: string;
    lastAccessed: number;
    accessCount: number;
    accessFrequency: number;
    consolidationPriority: number;
}

export interface ProcessedSignal {
    data: number[];
    context: NeuralContext;
    activation: number;
    shouldFire: boolean;
    timestamp: number;
    shouldStore?: boolean;
    id?: string;
}

export interface SignalMetadata {
    source: string;
    target: string;
    processingPower: number;
}

export interface Neuron {
    weights: number[];
    bias: number;
    activate(inputs: number[], activationFunction: string): number;
}

export interface Layer {
    neurons: Neuron[];
    activationFunction: string;
    activate(inputs: number[]): number[];
} 