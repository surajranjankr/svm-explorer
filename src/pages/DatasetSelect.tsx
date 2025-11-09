import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarginType } from "@/types/svm";
import { ArrowLeft, ArrowRight, Minus, AlertCircle, Waves } from "lucide-react";

const DatasetSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profession = searchParams.get("profession") || "medical";

  const handleDatasetSelect = (marginType: MarginType) => {
    navigate(`/visualizer?profession=${profession}&margin=${marginType}`);
  };

  const datasets: Array<{
    type: MarginType;
    title: string;
    description: string;
    icon: typeof Minus;
    difficulty: string;
  }> = [
    {
      type: "hard",
      title: "Hard Margin",
      description: "Perfectly separable data with a clear boundary. No overlap between classes.",
      icon: Minus,
      difficulty: "Beginner",
    },
    {
      type: "soft",
      title: "Soft Margin",
      description: "Mostly separable with some overlap. Allows for some misclassification.",
      icon: AlertCircle,
      difficulty: "Intermediate",
    },
    {
      type: "nonlinear",
      title: "Non-Linear Margin",
      description: "Complex patterns requiring curved decision boundaries. Needs kernel tricks.",
      icon: Waves,
      difficulty: "Advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Profession
          </Button>
          <h1 className="text-2xl font-bold">Select Dataset Type</h1>
          <p className="text-muted-foreground capitalize">
            Learning as: {profession} professional
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Understanding Margin Types</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Different real-world scenarios require different approaches. Start simple and progress
              to more complex patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {datasets.map((dataset) => {
              const Icon = dataset.icon;
              return (
                <Card
                  key={dataset.type}
                  className="p-6 hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50 flex flex-col"
                  onClick={() => handleDatasetSelect(dataset.type)}
                >
                  <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{dataset.title}</h3>
                      <p className="text-sm text-muted-foreground">{dataset.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 group-hover:border-primary/50">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DatasetSelect;
