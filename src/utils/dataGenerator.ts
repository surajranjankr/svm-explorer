import { DataPoint, MarginType } from "@/types/svm";

const DATASET_SIZE = 18; // Reduced for better understanding

// Generate synthetic dataset based on margin type
export const generateDataset = (marginType: MarginType): DataPoint[] => {
  const data: DataPoint[] = [];

  switch (marginType) {
    case "hard":
      // Perfectly linearly separable - clear demonstration of hard margin
      // Class 1: Top-left region (disease/high-risk)
      const class1Points = [
        { x: 15, y: 75 }, { x: 20, y: 80 }, { x: 25, y: 70 },
        { x: 30, y: 85 }, { x: 18, y: 65 }, { x: 28, y: 75 },
        { x: 22, y: 68 }, { x: 32, y: 78 }, { x: 16, y: 82 }
      ];
      class1Points.forEach(point => {
        data.push({ ...point, label: 1 });
      });

      // Class 0: Bottom-right region (healthy/low-risk)
      const class0Points = [
        { x: 70, y: 25 }, { x: 75, y: 30 }, { x: 65, y: 20 },
        { x: 80, y: 35 }, { x: 72, y: 18 }, { x: 68, y: 28 },
        { x: 78, y: 22 }, { x: 82, y: 32 }, { x: 66, y: 25 }
      ];
      class0Points.forEach(point => {
        data.push({ ...point, label: 0 });
      });
      break;

    case "soft":
      // Mostly separable with intentional overlap to show soft margin concept
      // Class 1: Top-left with some outliers
      const soft1Points = [
        { x: 18, y: 75 }, { x: 22, y: 82 }, { x: 28, y: 70 },
        { x: 25, y: 78 }, { x: 20, y: 68 }, { x: 32, y: 85 },
        { x: 45, y: 55 }, // Outlier crossing boundary
        { x: 16, y: 80 }, { x: 30, y: 72 }
      ];
      soft1Points.forEach(point => {
        data.push({ ...point, label: 1 });
      });

      // Class 0: Bottom-right with some outliers
      const soft0Points = [
        { x: 72, y: 25 }, { x: 78, y: 30 }, { x: 68, y: 20 },
        { x: 75, y: 28 }, { x: 80, y: 22 }, { x: 70, y: 32 },
        { x: 50, y: 48 }, // Outlier crossing boundary
        { x: 82, y: 26 }, { x: 66, y: 24 }
      ];
      soft0Points.forEach(point => {
        data.push({ ...point, label: 0 });
      });
      break;

    case "nonlinear":
      // Circular pattern - requires kernel trick
      const centerX = 50;
      const centerY = 50;
      
      // Inner circle - Class 1
      const innerAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      innerAngles.forEach(angle => {
        const rad = (angle * Math.PI) / 180;
        const radius = 18 + Math.random() * 6;
        data.push({
          x: centerX + Math.cos(rad) * radius,
          y: centerY + Math.sin(rad) * radius,
          label: 1,
        });
      });

      // Outer ring - Class 0
      const outerAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5, 382.5];
      outerAngles.forEach(angle => {
        const rad = (angle * Math.PI) / 180;
        const radius = 32 + Math.random() * 6;
        data.push({
          x: centerX + Math.cos(rad) * radius,
          y: centerY + Math.sin(rad) * radius,
          label: 0,
        });
      });
      break;
  }

  return data;
};

// Identify support vectors (simplified but educational)
export const identifySupportVectors = (
  data: DataPoint[],
  C: number
): DataPoint[] => {
  // Support vectors are the points closest to the decision boundary
  // Calculate distance from the diagonal boundary (x + y = 100)
  return data.map((point) => {
    const distanceFromBoundary = Math.abs(point.x + point.y - 100) / Math.sqrt(2);
    
    // Points within a threshold distance are support vectors
    // Higher C means stricter margin, fewer support vectors
    const threshold = 15 + (10 - C) * 3;
    const isNearBoundary = distanceFromBoundary < threshold;
    
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
