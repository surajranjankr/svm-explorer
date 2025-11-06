import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SVMPlot } from "@/components/SVMPlot";
import { ParameterGrid } from "@/components/ParameterGrid";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { generateDataset, identifySupportVectors } from "@/utils/dataGenerator";
import { calculateConfusionMatrix, calculateMetrics } from "@/utils/svmMetrics";
import { professionTerms } from "@/utils/professionTerms";
import { KernelType, Profession, MarginType } from "@/types/svm";
import { ArrowLeft, Settings, BarChart3, Grid3x3 } from "lucide-react";

const Visualizer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profession = (searchParams.get("profession") || "medical") as Profession;
  const marginType = (searchParams.get("margin") || "hard") as MarginType;

  const [kernel, setKernel] = useState<KernelType>("linear");
  const [C, setC] = useState(1);
  const [gamma, setGamma] = useState(0.1);

  const rawData = useMemo(() => generateDataset(marginType), [marginType]);
  const data = useMemo(() => identifySupportVectors(rawData, C), [rawData, C]);
  
  const confusionMatrix = useMemo(
    () => calculateConfusionMatrix(data, kernel, gamma),
    [data, kernel, gamma]
  );
  const metrics = useMemo(() => calculateMetrics(confusionMatrix), [confusionMatrix]);
  const terms = professionTerms[profession];

  const kernels: KernelType[] = ["linear", "rbf", "polynomial", "sigmoid"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/dataset?profession=${profession}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold">SVM Visualizer</h1>
              <p className="text-sm text-muted-foreground capitalize">
                {profession} • {marginType} margin
              </p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="aspect-square max-h-[600px]">
                <SVMPlot data={data} kernel={kernel} gamma={gamma} C={C} />
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-positive"></div>
                  <span>{terms.positive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-negative"></div>
                  <span>{terms.negative}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-chart-support"></div>
                  <span>Support Vectors</span>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metrics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="grid">
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Parameter Grid
                </TabsTrigger>
              </TabsList>
              <TabsContent value="metrics" className="mt-6">
                <MetricsDisplay
                  metrics={metrics}
                  confusionMatrix={confusionMatrix}
                  profession={profession}
                />
              </TabsContent>
              <TabsContent value="grid" className="mt-6">
                <ParameterGrid data={data} kernel={kernel} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Hyperparameters</h3>
              </div>

              <div className="space-y-6">
                {/* Kernel Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Kernel Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {kernels.map((k) => (
                      <Button
                        key={k}
                        variant={kernel === k ? "default" : "outline"}
                        size="sm"
                        onClick={() => setKernel(k)}
                        className="capitalize"
                      >
                        {k}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* C Parameter */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-sm font-semibold">Regularization (C)</Label>
                    <span className="text-sm font-mono text-muted-foreground">{C.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[C]}
                    onValueChange={([value]) => setC(value)}
                    min={0.1}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the trade-off between margin size and misclassification
                  </p>
                </div>

                {/* Gamma Parameter */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-sm font-semibold">Gamma (γ)</Label>
                    <span className="text-sm font-mono text-muted-foreground">{gamma.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[gamma]}
                    onValueChange={([value]) => setGamma(value)}
                    min={0.01}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Defines influence of single training examples
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Points</span>
                  <span className="font-semibold">{data.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Support Vectors</span>
                  <span className="font-semibold">
                    {data.filter((d) => d.isSupportVector).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{terms.positive}</span>
                  <span className="font-semibold text-success">
                    {data.filter((d) => d.label === 1).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{terms.negative}</span>
                  <span className="font-semibold text-destructive">
                    {data.filter((d) => d.label === 0).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Visualizer;
