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

// Identify support vectors (data-driven for linear)
export const identifySupportVectors = (
  data: DataPoint[],
  C: number
): DataPoint[] => {
  // Compute dynamic linear boundary from centroids
  const class1 = data.filter((d) => d.label === 1);
  const class0 = data.filter((d) => d.label === 0);

  let a = 1, b = 1, c = -105; // fallback line x + y - 105 = 0
  if (class1.length > 0 && class0.length > 0) {
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
  const marginDistance = 10 / Math.max(C, 0.1);
  const cAdj = c + 6 * (1 / Math.max(C, 0.1) - 1) * norm; // same shift as boundary

  return data.map((point) => {
    const distance = Math.abs(a * point.x + b * point.y + cAdj) / norm;
    return {
      ...point,
      isSupportVector: distance <= marginDistance,
    };
  });
};

// Calculate decision boundary points based on kernel type
export const calculateDecisionBoundary = (
  kernel: string,
  gamma: number,
  data?: DataPoint[],
  C?: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];

  if (kernel === "linear") {
    // Compute a dynamic linear separator from data (perpendicular bisector of class centroids)
    // Line form: a x + b y + c = 0, where [a,b] is normal vector
    let a = 1;
    let b = 1;
    let c = -105; // Default to x + y - 105 = 0 (y = -x + 105)

    if (data && data.length > 1) {
      const class1 = data.filter((d) => d.label === 1);
      const class0 = data.filter((d) => d.label === 0);
      if (class1.length > 0 && class0.length > 0) {
        const c1 = {
          x: class1.reduce((s, p) => s + p.x, 0) / class1.length,
          y: class1.reduce((s, p) => s + p.y, 0) / class1.length,
        };
        const c0 = {
          x: class0.reduce((s, p) => s + p.x, 0) / class0.length,
          y: class0.reduce((s, p) => s + p.y, 0) / class0.length,
        };
        const w = { x: c1.x - c0.x, y: c1.y - c0.y };
        a = w.x;
        b = w.y;
        const m = { x: (c1.x + c0.x) / 2, y: (c1.y + c0.y) / 2 };
        c = -(a * m.x + b * m.y);
      }
    }

    // Adjust boundary slightly with C to visualize hyperparameter effect
    const norm = Math.sqrt(a * a + b * b) || 1;
    let cAdj = c;
    if (typeof C === "number") {
      const d = 6 * (1 / Math.max(C, 0.1) - 1); // shift distance along normal
      cAdj = c + d * norm; // move line along its normal
    }

    // Sample points along the visible area
    if (Math.abs(b) > 1e-6) {
      for (let x = 0; x <= 100; x += 2) {
        const y = (-a * x - cAdj) / b;
        if (y >= 0 && y <= 100) points.push({ x, y });
      }
    } else {
      const xConst = -cAdj / (a || 1);
      for (let y = 0; y <= 100; y += 2) {
        if (xConst >= 0 && xConst <= 100) points.push({ x: xConst, y });
      }
    }

    return points;
  } else if (kernel === "rbf") {
    // Curved boundary for RBF kernel (illustrative)
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + 20 * Math.sin((x / 100) * Math.PI * 2 * gamma);
      if (y >= 0 && y <= 100) {
        points.push({ x, y });
      }
    }
  } else if (kernel === "polynomial") {
    // Polynomial curve (illustrative)
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
  C: number,
  data?: DataPoint[],
  gamma?: number
): { upper: { x: number; y: number }[]; lower: { x: number; y: number }[] } => {
  const marginDistance = 10 / Math.max(C, 0.1); // Margin width inversely proportional to C
  
  if (kernel === "linear") {
    // Rebuild the same linear boundary as in calculateDecisionBoundary
    let a = 1, b = 1, c = -105;
    if (data && data.length > 1) {
      const class1 = data.filter((d) => d.label === 1);
      const class0 = data.filter((d) => d.label === 0);
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
    }

    const norm = Math.sqrt(a * a + b * b) || 1;
    const cAdj = c + 6 * (1 / Math.max(C, 0.1) - 1) * norm;

    const upper: { x: number; y: number }[] = [];
    const lower: { x: number; y: number }[] = [];

    const cUpper = cAdj + marginDistance * norm;
    const cLower = cAdj - marginDistance * norm;

    if (Math.abs(b) > 1e-6) {
      for (let x = 0; x <= 100; x += 2) {
        const yU = (-a * x - cUpper) / b;
        const yL = (-a * x - cLower) / b;
        if (yU >= 0 && yU <= 100) upper.push({ x, y: yU });
        if (yL >= 0 && yL <= 100) lower.push({ x, y: yL });
      }
    } else {
      const xU = -cUpper / (a || 1);
      const xL = -cLower / (a || 1);
      for (let y = 0; y <= 100; y += 2) {
        if (xU >= 0 && xU <= 100) upper.push({ x: xU, y });
        if (xL >= 0 && xL <= 100) lower.push({ x: xL, y });
      }
    }

    return { upper, lower };
  } else if (kernel === "rbf") {
    // Curved margins for RBF kernel
    const upper: { x: number; y: number }[] = [];
    const lower: { x: number; y: number }[] = [];
    
    for (let x = 0; x <= 100; x += 2) {
      const centerY = 50 + 20 * Math.sin((x / 100) * Math.PI * 2 * (gamma || 1));
      const yUpper = centerY + marginDistance;
      const yLower = centerY - marginDistance;
      
      if (yUpper >= 0 && yUpper <= 100) upper.push({ x, y: yUpper });
      if (yLower >= 0 && yLower <= 100) lower.push({ x, y: yLower });
    }
    
    return { upper, lower };
  } else if (kernel === "polynomial") {
    // Curved margins for polynomial kernel
    const upper: { x: number; y: number }[] = [];
    const lower: { x: number; y: number }[] = [];
    
    for (let x = 0; x <= 100; x += 2) {
      const normalized = (x - 50) / 50;
      const centerY = 50 + 20 * Math.pow(normalized, 3) * (gamma || 1);
      const yUpper = centerY + marginDistance;
      const yLower = centerY - marginDistance;
      
      if (yUpper >= 0 && yUpper <= 100) upper.push({ x, y: yUpper });
      if (yLower >= 0 && yLower <= 100) lower.push({ x, y: yLower });
    }
    
    return { upper, lower };
  }
  
  return { upper: [], lower: [] };
};
