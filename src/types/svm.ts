export type Profession = "medical" | "finance" | "marketing" | "engineering";

export type MarginType = "hard" | "soft" | "nonlinear";

export type KernelType = "linear" | "rbf" | "polynomial";

export interface DataPoint {
  x: number;
  y: number;
  label: 0 | 1;
  isSupportVector?: boolean;
}

export interface SVMParams {
  kernel: KernelType;
  C: number;
  gamma: number;
  degree?: number;
}

export interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface ConfusionMatrix {
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
}

export interface ProfessionTerms {
  positive: string;
  negative: string;
  truePositive: string;
  trueNegative: string;
  falsePositive: string;
  falseNegative: string;
  accuracy: string;
  precision: string;
  recall: string;
}
