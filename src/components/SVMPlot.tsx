import { useMemo } from "react";
import { DataPoint } from "@/types/svm";
import { calculateDecisionBoundary } from "@/utils/dataGenerator";

interface SVMPlotProps {
  data: DataPoint[];
  kernel: string;
  gamma: number;
  showBoundary?: boolean;
  className?: string;
}

export const SVMPlot = ({ data, kernel, gamma, showBoundary = true, className = "" }: SVMPlotProps) => {
  const boundaryPoints = useMemo(
    () => (showBoundary ? calculateDecisionBoundary(kernel, gamma) : []),
    [kernel, gamma, showBoundary]
  );

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ backgroundColor: "hsl(var(--card))" }}
    >
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pos) => (
        <g key={pos}>
          <line
            x1={pos}
            y1={0}
            x2={pos}
            y2={100}
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
            opacity="0.3"
          />
          <line
            x1={0}
            y1={pos}
            x2={100}
            y2={pos}
            stroke="hsl(var(--border))"
            strokeWidth="0.2"
            opacity="0.3"
          />
        </g>
      ))}

      {/* Decision boundary */}
      {showBoundary && boundaryPoints.length > 1 && (
        <path
          d={`M ${boundaryPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`}
          stroke="hsl(var(--decision-boundary))"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="2,2"
          opacity="0.8"
        />
      )}

      {/* Data points - larger and more visible */}
      {data.map((point, i) => (
        <g key={i}>
          {/* Support vector ring - more prominent */}
          {point.isSupportVector && (
            <circle
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="none"
              stroke="hsl(var(--support-vector))"
              strokeWidth="1"
              opacity="0.9"
            />
          )}
          {/* Data point - larger for visibility */}
          <circle
            cx={point.x}
            cy={point.y}
            r="2"
            fill={
              point.label === 1
                ? "hsl(var(--class-positive))"
                : "hsl(var(--class-negative))"
            }
            opacity="1"
            stroke="hsl(var(--card))"
            strokeWidth="0.5"
          />
        </g>
      ))}
    </svg>
  );
};
