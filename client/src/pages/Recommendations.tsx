import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { Card } from "@/components/ui/card";
import { TrendingDown, Zap, Leaf } from "lucide-react";
import { useRecommendations, useStatistics } from "@/hooks/useAnalysis";

export default function Recommendations() {
  const { data: recommendations, isLoading } = useRecommendations();
  const { data: stats } = useStatistics();

  const handleApply = (id: string) => {
    console.log("Recommendation clicked:", id);
  };

  const highImpact = recommendations?.filter((r) => r.impact === "high").length || 0;
  const mediumImpact = recommendations?.filter((r) => r.impact === "medium").length || 0;
  const potentialSavings = stats ? (stats.meanEnergy * 0.42).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Energy-Saving Recommendations
        </h1>
        <p className="mt-2 text-muted-foreground">
          Actionable insights to optimize your models for sustainability
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Leaf className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recommendations?.length || 0}</p>
              <p className="text-sm text-muted-foreground">
                Active Recommendations
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{potentialSavings} kWh</p>
              <p className="text-sm text-muted-foreground">
                Potential Energy Savings
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Zap className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{(parseFloat(potentialSavings) * 0.437).toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                kg CO₂ Reduction
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationsPanel
            recommendations={recommendations}
            onApply={handleApply}
          />
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Impact Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Impact</span>
                <span className="text-sm font-semibold text-success">
                  {highImpact} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Impact</span>
                <span className="text-sm font-semibold text-warning">
                  {mediumImpact} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Impact</span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {(recommendations?.length || 0) - highImpact - mediumImpact} items
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">Quick Wins</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start with these easy-to-implement optimizations for immediate
              results
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Enable mixed precision training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Optimize batch size</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Schedule off-peak training</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
