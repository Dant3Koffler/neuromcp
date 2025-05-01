import { Network, Layer, Neuron, ActivationFunction } from '@neuro-mcp/server';
import { MarketData, AnalysisResult, MarketPattern, MarketPrediction } from './types';

export interface MarketPattern {
    type: 'trend' | 'support' | 'resistance' | 'chart';
    confidence: number;
    startTime: number;
    endTime: number;
}

export interface MarketPrediction {
    type: 'trend' | 'price' | 'volatility';
    value: number;
    confidence: number;
    timeframe: string;
}

export class MarketAnalysisNetwork {
    private network: Network;
    private readonly inputSize: number = 10; // Number of price points to analyze
    private readonly hiddenSize: number = 20;
    private readonly outputSize: number = 2; // Pattern and prediction outputs
    private confidenceThreshold: number = 0.7;
    private maxPredictions: number = 5;

    constructor() {
        this.network = new Network();
        this.initializeNetwork();
    }

    private initializeNetwork(): void {
        // Input layer for market data
        const inputLayer = new Layer(this.inputSize, ActivationFunction.SIGMOID);
        
        // Hidden layers for pattern recognition and analysis
        const hiddenLayer1 = new Layer(this.hiddenSize, ActivationFunction.RELU);
        const hiddenLayer2 = new Layer(15, ActivationFunction.RELU);
        
        // Output layer for predictions
        const outputLayer = new Layer(this.outputSize, ActivationFunction.SIGMOID);

        this.network.addLayer(inputLayer);
        this.network.addLayer(hiddenLayer1);
        this.network.addLayer(hiddenLayer2);
        this.network.addLayer(outputLayer);
    }

    public analyzeMarketData(data: MarketData): AnalysisResult {
        const input = this.prepareInput(data);
        const output = this.network.forward(input);
        
        const patterns = this.extractPatterns(output);
        const predictions = this.extractPredictions(output);
        
        return {
            patterns,
            predictions,
            confidence: this.calculateConfidence(output),
            timestamp: Date.now()
        };
    }

    private prepareInput(data: MarketData): number[] {
        // Normalize price data
        const normalizedPrices = this.normalizeData(data.prices);
        return normalizedPrices;
    }

    private normalizeData(data: number[]): number[] {
        const min = Math.min(...data);
        const max = Math.max(...data);
        return data.map(value => (value - min) / (max - min));
    }

    private extractPatterns(output: number[]): MarketPattern[] {
        const patterns: MarketPattern[] = [];
        const patternTypes: Array<MarketPattern['type']> = ['trend', 'support', 'resistance', 'chart'];
        
        for (const type of patternTypes) {
            const confidence = output[0];
            if (confidence >= this.confidenceThreshold) {
                patterns.push({
                    type,
                    confidence,
                    startTime: Date.now(),
                    endTime: Date.now() + 3600000, // 1 hour
                    parameters: {}
                });
            }
        }
        
        return patterns;
    }

    private extractPredictions(output: number[]): MarketPrediction[] {
        const predictions: MarketPrediction[] = [];
        const predictionTypes: Array<MarketPrediction['type']> = ['trend', 'price', 'volatility'];
        const timeframes: Array<MarketPrediction['timeframe']> = ['short-term', 'medium-term', 'long-term'];
        
        for (const type of predictionTypes) {
            for (const timeframe of timeframes) {
                const confidence = output[1];
                if (confidence >= this.confidenceThreshold) {
                    predictions.push({
                        type,
                        value: output[2],
                        confidence,
                        timeframe
                    });
                }
            }
        }
        
        return predictions.slice(0, this.maxPredictions);
    }

    private calculateConfidence(output: number[]): number {
        return output.reduce((sum, value) => sum + value, 0) / output.length;
    }
}

export interface MarketAnalysisResult {
    predictions: MarketPrediction[];
    patterns: MarketPattern[];
    trend: MarketTrend;
    confidence: number;
}

export interface MarketPrediction {
    price: number;
    confidence: number;
    timestamp: number;
}

export interface MarketPattern {
    type: string;
    confidence: number;
}

export interface MarketTrend {
    direction: 'UP' | 'DOWN';
    strength: number;
} 