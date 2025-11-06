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
  // For linear: decision boundary is y = -x + 105
  const dataWithDistances = data.map((point) => {
    // Distance from point to line: |ax + by + c| / sqrt(a^2 + b^2)
    // Line equation: x + y - 105 = 0
    const distanceFromBoundary = Math.abs(point.x + point.y - 105) / Math.sqrt(2);
    return { point, distance: distanceFromBoundary };
  });
  
  // Sort by distance to find closest points
  dataWithDistances.sort((a, b) => a.distance - b.distance);
  
  // Calculate margin width - higher C means narrower margin, fewer support vectors
  const marginWidth = 10 / C;
  
  // Mark points within the margin as support vectors
  return dataWithDistances.map(({ point, distance }) => {
    // Points within margin width are support vectors
    const isSupportVector = distance <= marginWidth;
    
    return {
      ...point,
      isSupportVector,
    };
  });
};

// Calculate decision boundary points based on kernel type
export const calculateDecisionBoundary = (
  kernel: string,
  gamma: number,
  marginType?: MarginType
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  
  if (kernel === "linear") {
    // Optimal linear boundary: y = -x + 105
    // This properly separates the classes
    for (let x = 0; x <= 100; x += 2) {
      const y = -x + 105;
      if (y >= 0 && y <= 100) {
        points.push({ x, y });
      }
    }
  } else if (kernel === "rbf" || kernel === "sigmoid") {
    // Curved boundary for non-linear kernels
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + 20 * Math.sin((x / 100) * Math.PI * 2 * gamma);
      if (y >= 0 && y <= 100) {
        points.push({ x, y });
      }
    }
  } else if (kernel === "polynomial") {
    // Polynomial curve
    for (let x = 0; x <= 100; x += 2) {
      const normalized = (x - 50) / 50;
      const y = 50 + 20 * Math.pow(normalized, 3) * gamma;
      if (y >= 0 && y <= 100) {
        points.push({ x, y });
      }
    }
  }
  
  return points;
};

// Calculate margin boundaries (parallel lines to decision boundary)
export const calculateMargins = (
  kernel: string,
  C: number
): { upper: { x: number; y: number }[]; lower: { x: number; y: number }[] } => {
  const marginWidth = 10 / C; // Margin width inversely proportional to C
  
  if (kernel === "linear") {
    const upper: { x: number; y: number }[] = [];
    const lower: { x: number; y: number }[] = [];
    
    for (let x = 0; x <= 100; x += 2) {
      const yUpper = -x + 105 + marginWidth;
      const yLower = -x + 105 - marginWidth;
      
      if (yUpper >= 0 && yUpper <= 100) {
        upper.push({ x, y: yUpper });
      }
      if (yLower >= 0 && yLower <= 100) {
        lower.push({ x, y: yLower });
      }
    }
    
    return { upper, lower };
  }
  
  return { upper: [], lower: [] };
};
