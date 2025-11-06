import { DataPoint, PerformanceMetrics, ConfusionMatrix, KernelType } from "@/types/svm";

// RBF kernel function
const rbfKernel = (x1: number, y1: number, x2: number, y2: number, gamma: number): number => {
  const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  return Math.exp(-gamma * dist * dist);
};

// Polynomial kernel function
const polynomialKernel = (x1: number, y1: number, x2: number, y2: number, degree: number = 3): number => {
  const dot = x1 * x2 + y1 * y2;
  return Math.pow(dot + 1, degree);
};

// Sigmoid kernel function
const sigmoidKernel = (x1: number, y1: number, x2: number, y2: number): number => {
  const dot = x1 * x2 + y1 * y2;
  return Math.tanh(0.01 * dot + 1);
};

// Predict label based on kernel and parameters
const predictLabel = (
  point: DataPoint,
  allPoints: DataPoint[],
  kernel: KernelType,
  gamma: number,
  C: number
): 0 | 1 => {
  if (kernel === "linear") {
    // Linear decision boundary: y = -x + 105
    // Simple linear classification
    return point.y > -point.x + 105 ? 1 : 0;
  }

  // For non-linear kernels, use kernel-based decision function
  const supportVectors = allPoints.filter((p) => p.isSupportVector);
  
  if (supportVectors.length === 0) {
    // Fallback if no support vectors
    return point.y > -point.x + 105 ? 1 : 0;
  }

  let decision = 0;
  
  // SVM decision function: sum of alpha * y * K(x, x_i)
  supportVectors.forEach((sv) => {
    const alpha = 1.0; // Simplified - in real SVM this is learned
    const y_i = sv.label === 1 ? 1 : -1;
    let kernelValue = 0;

    switch (kernel) {
      case "rbf":
        kernelValue = rbfKernel(point.x, point.y, sv.x, sv.y, gamma);
        break;
      case "polynomial":
        kernelValue = polynomialKernel(point.x, point.y, sv.x, sv.y, 3);
        break;
      case "sigmoid":
        kernelValue = sigmoidKernel(point.x, point.y, sv.x, sv.y);
        break;
    }

    decision += alpha * y_i * kernelValue;
  });

  // Bias term - calculated from support vectors
  // For visualization purposes, we adjust based on the distribution
  const positiveSVs = supportVectors.filter(sv => sv.label === 1).length;
  const negativeSVs = supportVectors.filter(sv => sv.label === 0).length;
  const bias = (positiveSVs - negativeSVs) * 0.1;

  // Classification: sign(decision + bias)
  return decision + bias > 0 ? 1 : 0;
};

// Calculate confusion matrix
export const calculateConfusionMatrix = (
  data: DataPoint[],
  kernel: KernelType,
  gamma: number,
  C: number
): ConfusionMatrix => {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  data.forEach((point) => {
    const predicted = predictLabel(point, data, kernel, gamma, C);
    const actual = point.label;

    if (predicted === 1 && actual === 1) truePositive++;
    else if (predicted === 0 && actual === 0) trueNegative++;
    else if (predicted === 1 && actual === 0) falsePositive++;
    else if (predicted === 0 && actual === 1) falseNegative++;
  });

  return { truePositive, trueNegative, falsePositive, falseNegative };
};

// Calculate performance metrics
export const calculateMetrics = (
  confusionMatrix: ConfusionMatrix
): PerformanceMetrics => {
  const { truePositive, trueNegative, falsePositive, falseNegative } = confusionMatrix;
  const total = truePositive + trueNegative + falsePositive + falseNegative;

  const accuracy = (truePositive + trueNegative) / total;
  const precision = truePositive / (truePositive + falsePositive) || 0;
  const recall = truePositive / (truePositive + falseNegative) || 0;
  const f1Score = (2 * precision * recall) / (precision + recall) || 0;

  return {
    accuracy: Math.round(accuracy * 100) / 100,
    precision: Math.round(precision * 100) / 100,
    recall: Math.round(recall * 100) / 100,
    f1Score: Math.round(f1Score * 100) / 100,
  };
};
