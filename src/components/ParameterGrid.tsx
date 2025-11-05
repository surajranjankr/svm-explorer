import { Card } from "@/components/ui/card";
import { SVMPlot } from "./SVMPlot";
import { DataPoint, KernelType } from "@/types/svm";

interface ParameterGridProps {
  data: DataPoint[];
  kernel: KernelType;
}

export const ParameterGrid = ({ data, kernel }: ParameterGridProps) => {
  const cValues = [0.1, 1, 10];
  const gammaValues = [0.01, 0.1, 1];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Parameter Combinations Grid</h3>
        <p className="text-sm text-muted-foreground">
          Explore how different C and gamma values affect the decision boundary
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {/* Header row */}
        <div className="flex items-center justify-center font-semibold text-sm">
          C \ γ
        </div>
        {gammaValues.map((gamma) => (
          <div key={gamma} className="text-center font-semibold text-sm p-2 bg-muted rounded">
            γ = {gamma}
          </div>
        ))}

        {/* Grid rows */}
        {cValues.map((c) => (
          <>
            <div key={`label-${c}`} className="flex items-center justify-center font-semibold text-sm bg-muted rounded">
              C = {c}
            </div>
            {gammaValues.map((gamma) => (
              <Card key={`${c}-${gamma}`} className="p-2 aspect-square">
                <SVMPlot
                  data={data}
                  kernel={kernel}
                  gamma={gamma}
                  showBoundary={true}
                />
              </Card>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};
