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


// Predict label based on kernel and parameters
const predictLabel = (
  point: DataPoint,
  allPoints: DataPoint[],
  kernel: KernelType,
  gamma: number,
  C: number,
  degree: number = 3
): 0 | 1 => {
  if (kernel === "linear") {
    // Data-driven linear hyperplane using centroids
    const class1 = allPoints.filter((d) => d.label === 1);
    const class0 = allPoints.filter((d) => d.label === 0);

    let a = 1, b = 1, c = -105; // fallback
    if (class1.length && class0.length) {
      const c1 = {
        x: class1.reduce((s, p) => s + p.x, 0) / class1.length,
        y: class1.reduce((s, p) => s + p.y, 0) / class1.length,
      };
      const c0 = {
        x: class0.reduce((s, p) => s + p.x, 0) / class0.length,
        y: class0.reduce((s, p) => s + p.y, 0) / class0.length,
      };
      const w = { x: c1.x - c0.x, y: c1.y - c0.y };
      a = w.x; b = w.y;
      const m = { x: (c1.x + c0.x) / 2, y: (c1.y + c0.y) / 2 };
      c = -(a * m.x + b * m.y);
    }
    const norm = Math.sqrt(a * a + b * b) || 1;
    const cAdj = c + 6 * (1 / Math.max(C, 0.1) - 1) * norm;
    const decision = a * point.x + b * point.y + cAdj;
    return decision > 0 ? 1 : 0;
  }

  // For RBF kernel, use the same boundary formula as visualization
  if (kernel === "rbf") {
    const centerY = 50 + 20 * Math.sin((point.x / 100) * Math.PI * 2 * gamma);
    return point.y > centerY ? 1 : 0;
  }

  // For polynomial kernel, use the same boundary formula as visualization
  if (kernel === "polynomial") {
    const normalized = (point.x - 50) / 50;
    const centerY = 50 + 20 * Math.pow(normalized, degree) * gamma;
    return point.y > centerY ? 1 : 0;
  }

  // Fallback
  return point.y > -point.x + 105 ? 1 : 0;
};

// Calculate confusion matrix
export const calculateConfusionMatrix = (
  data: DataPoint[],
  kernel: KernelType,
  gamma: number,
  C: number,
  degree: number = 3
): ConfusionMatrix => {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  data.forEach((point) => {
    const predicted = predictLabel(point, data, kernel, gamma, C, degree);
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
