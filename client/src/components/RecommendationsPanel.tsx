import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Zap,
  Leaf,
  TrendingDown,
  Settings,
  Cpu,
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  savings: string;
}

interface RecommendationsPanelProps {
  recommendations?: Recommendation[];
  onApply?: (id: string) => void;
}

const iconMap: Record<string, any> = {
  optimization: Zap,
  efficiency: Leaf,
  reduction: TrendingDown,
  configuration: Settings,
  hardware: Cpu,
  default: Lightbulb,
};

export function RecommendationsPanel({
  recommendations = [],
  onApply,
}: RecommendationsPanelProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Energy-Saving Recommendations</h3>
        <p className="text-sm text-muted-foreground">
          Actionable insights to reduce your model's carbon footprint
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Lightbulb className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Upload and analyze data to receive recommendations
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const Icon = iconMap[rec.category] || iconMap.default;
            return (
              <div
                key={rec.id}
                className="flex items-start gap-4 rounded-lg border p-4 hover-elevate"
                data-testid={`recommendation-${rec.id}`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge
                      variant="outline"
                      className={getImpactColor(rec.impact)}
                    >
                      {rec.impact} impact
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {rec.savings}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  {onApply && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApply(rec.id)}
                      data-testid={`button-apply-${rec.id}`}
                    >
                      Learn More
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
