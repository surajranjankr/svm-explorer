import { DataPoint, MarginType } from "@/types/svm";

const DATASET_SIZE = 100;

// Generate synthetic dataset based on margin type
export const generateDataset = (marginType: MarginType): DataPoint[] => {
  const data: DataPoint[] = [];

  switch (marginType) {
    case "hard":
      // Linearly separable data with clear margin
      for (let i = 0; i < DATASET_SIZE / 2; i++) {
        data.push({
          x: Math.random() * 40 + 10,
          y: Math.random() * 40 + 50,
          label: 1,
        });
        data.push({
          x: Math.random() * 40 + 50,
          y: Math.random() * 40 + 10,
          label: 0,
        });
      }
      break;

    case "soft":
      // Mostly separable with some overlap
      for (let i = 0; i < DATASET_SIZE / 2; i++) {
        // Class 1 with some noise
        const noise1 = Math.random() < 0.1 ? 20 : 0;
        data.push({
          x: Math.random() * 40 + 10 + noise1,
          y: Math.random() * 40 + 50 - noise1,
          label: 1,
        });
        // Class 0 with some noise
        const noise2 = Math.random() < 0.1 ? 20 : 0;
        data.push({
          x: Math.random() * 40 + 50 - noise2,
          y: Math.random() * 40 + 10 + noise2,
          label: 0,
        });
      }
      break;

    case "nonlinear":
      // Non-linearly separable (circular pattern)
      for (let i = 0; i < DATASET_SIZE; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const radius = Math.random() * 20 + 15;
        const centerX = 50;
        const centerY = 50;
        
        if (Math.random() < 0.5) {
          // Inner circle (class 1)
          data.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            label: 1,
          });
        } else {
          // Outer circle (class 0)
          const outerRadius = radius + 25;
          data.push({
            x: centerX + Math.cos(angle) * outerRadius,
            y: centerY + Math.sin(angle) * outerRadius,
            label: 0,
          });
        }
      }
      break;
  }

  return data;
};

// Identify support vectors (simplified simulation)
export const identifySupportVectors = (
  data: DataPoint[],
  C: number
): DataPoint[] => {
  // In a real SVM, support vectors are found during training
  // Here we simulate by finding points near the decision boundary
  return data.map((point) => {
    const isNearBoundary = Math.random() < 0.15; // Simulate ~15% as support vectors
    return {
      ...point,
      isSupportVector: isNearBoundary,
    };
  });
};

// Calculate decision boundary points (simplified)
export const calculateDecisionBoundary = (
  kernel: string,
  gamma: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  
  if (kernel === "linear") {
    // Simple diagonal line
    for (let x = 0; x <= 100; x += 5) {
      points.push({ x, y: 100 - x });
    }
  } else if (kernel === "rbf" || kernel === "sigmoid") {
    // Curved boundary
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + 20 * Math.sin((x / 100) * Math.PI * 2 * gamma);
      points.push({ x, y });
    }
  } else if (kernel === "polynomial") {
    // Polynomial curve
    for (let x = 0; x <= 100; x += 2) {
      const normalized = (x - 50) / 50;
      const y = 50 + 20 * Math.pow(normalized, 3) * gamma;
      points.push({ x, y });
    }
  }
  
  return points;
};
