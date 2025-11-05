import { Card } from "@/components/ui/card";
import { PerformanceMetrics, ConfusionMatrix, Profession } from "@/types/svm";
import { professionTerms } from "@/utils/professionTerms";
import { TrendingUp, Target, Zap, Award } from "lucide-react";

interface MetricsDisplayProps {
  metrics: PerformanceMetrics;
  confusionMatrix: ConfusionMatrix;
  profession: Profession;
}

export const MetricsDisplay = ({ metrics, confusionMatrix, profession }: MetricsDisplayProps) => {
  const terms = professionTerms[profession];

  const metricsData = [
    {
      label: terms.accuracy,
      value: metrics.accuracy,
      icon: Award,
      color: "text-primary",
    },
    {
      label: terms.precision,
      value: metrics.precision,
      icon: Target,
      color: "text-secondary",
    },
    {
      label: terms.recall,
      value: metrics.recall,
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      label: "F1 Score",
      value: metrics.f1Score,
      icon: Zap,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div>
        <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricsData.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="p-4 text-center space-y-2">
                <Icon className={`w-6 h-6 mx-auto ${metric.color}`} />
                <div className="text-3xl font-bold">{(metric.value * 100).toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Confusion Matrix */}
      <div>
        <h3 className="text-xl font-bold mb-4">Confusion Matrix</h3>
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Headers */}
            <div></div>
            <div className="text-center font-semibold text-sm">
              Predicted<br/>{terms.positive}
            </div>
            <div className="text-center font-semibold text-sm">
              Predicted<br/>{terms.negative}
            </div>

            {/* Row 1 */}
            <div className="flex items-center font-semibold text-sm">
              Actual<br/>{terms.positive}
            </div>
            <Card className="p-4 bg-success/10 border-success/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{confusionMatrix.truePositive}</div>
                <div className="text-xs text-muted-foreground mt-1">{terms.truePositive}</div>
              </div>
            </Card>
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{confusionMatrix.falseNegative}</div>
                <div className="text-xs text-muted-foreground mt-1">{terms.falseNegative}</div>
              </div>
            </Card>

            {/* Row 2 */}
            <div className="flex items-center font-semibold text-sm">
              Actual<br/>{terms.negative}
            </div>
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{confusionMatrix.falsePositive}</div>
                <div className="text-xs text-muted-foreground mt-1">{terms.falsePositive}</div>
              </div>
            </Card>
            <Card className="p-4 bg-success/10 border-success/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{confusionMatrix.trueNegative}</div>
                <div className="text-xs text-muted-foreground mt-1">{terms.trueNegative}</div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};
