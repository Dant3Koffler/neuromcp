export interface MarketData {
    prices: number[];
    volumes: number[];
    timestamp: number;
}

export interface MarketPattern {
    type: 'trend' | 'support' | 'resistance' | 'chart';
    confidence: number;
    startTime?: number;
    endTime?: number;
    parameters?: Record<string, any>;
}

export interface MarketPrediction {
    type: 'trend' | 'price' | 'volatility';
    value: number;
    confidence: number;
    timeframe: 'short-term' | 'medium-term' | 'long-term';
}

export interface AnalysisResult {
    patterns: MarketPattern[];
    predictions: MarketPrediction[];
    confidence: number;
    timestamp: number;
} 