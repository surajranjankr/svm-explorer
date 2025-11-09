import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profession } from "@/types/svm";
import { professionDescriptions, professionIcons } from "@/utils/professionTerms";
import { Brain, ArrowRight } from "lucide-react";

const ProfessionSelect = () => {
  const navigate = useNavigate();

  const handleProfessionSelect = (profession: Profession) => {
    navigate(`/dataset?profession=${profession}`);
  };

  const professions: Profession[] = ["medical", "finance", "marketing", "engineering"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                SVM Visualizer
              </h1>
              <p className="text-sm text-muted-foreground">Learn machine learning in your field</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold no-underline">Choose Your Profession</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {professions.map((profession) => (
              <Card
                key={profession}
                className="p-6 hover:shadow-[var(--shadow-card)] transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50"
                onClick={() => handleProfessionSelect(profession)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-5xl">{professionIcons[profession]}</div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold capitalize mb-2">{profession}</h3>
                    <p className="text-muted-foreground">{professionDescriptions[profession]}</p>
                  </div>
                  <Button variant="outline" className="w-full group-hover:border-primary/50">
                    Start Learning
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionSelect;
