import { DataPoint, PerformanceMetrics, ConfusionMatrix } from "@/types/svm";

// Simulate predictions based on a simple decision boundary
const predictLabel = (point: DataPoint): 0 | 1 => {
  // Simple diagonal boundary for simulation
  return point.x + point.y > 100 ? 0 : 1;
};

// Calculate confusion matrix
export const calculateConfusionMatrix = (data: DataPoint[]): ConfusionMatrix => {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  data.forEach((point) => {
    const predicted = predictLabel(point);
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
