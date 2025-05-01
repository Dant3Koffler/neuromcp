import { Neuron, Layer } from './types';

export enum ActivationFunction {
    SIGMOID = 'sigmoid',
    RELU = 'relu',
    TANH = 'tanh'
}

export class Network {
    private layers: Layer[] = [];

    constructor() {
        this.layers = [];
    }

    public addLayer(layer: Layer): void {
        this.layers.push(layer);
    }

    public forward(inputs: number[]): number[] {
        let currentInputs = inputs;
        
        for (const layer of this.layers) {
            currentInputs = layer.activate(currentInputs);
        }
        
        return currentInputs;
    }
}

export class Layer {
    private neurons: Neuron[] = [];
    private activationFunction: ActivationFunction;

    constructor(size: number, activationFunction: ActivationFunction) {
        this.activationFunction = activationFunction;
        this.neurons = Array(size).fill(null).map(() => new Neuron());
    }

    public activate(inputs: number[]): number[] {
        return this.neurons.map(neuron => neuron.activate(inputs, this.activationFunction));
    }
}

export class Neuron {
    private weights: number[] = [];
    private bias: number = 0;

    constructor() {
        this.weights = [];
        this.bias = Math.random() * 2 - 1; // Random bias between -1 and 1
    }

    public activate(inputs: number[], activationFunction: ActivationFunction): number {
        if (this.weights.length === 0) {
            this.weights = inputs.map(() => Math.random() * 2 - 1); // Random weights between -1 and 1
        }

        const weightedSum = inputs.reduce((sum, input, i) => sum + input * this.weights[i], 0) + this.bias;
        
        switch (activationFunction) {
            case ActivationFunction.SIGMOID:
                return this.sigmoid(weightedSum);
            case ActivationFunction.RELU:
                return this.relu(weightedSum);
            case ActivationFunction.TANH:
                return this.tanh(weightedSum);
            default:
                return weightedSum;
        }
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private relu(x: number): number {
        return Math.max(0, x);
    }

    private tanh(x: number): number {
        return Math.tanh(x);
    }
} 