import { RecommendationsPanel } from "../RecommendationsPanel";

export default function RecommendationsPanelExample() {
  const mockRecommendations = [
    {
      id: "1",
      title: "Implement Model Quantization",
      description:
        "Reduce model precision from FP32 to INT8 to decrease energy consumption by up to 40% while maintaining 98% accuracy.",
      impact: "high" as const,
      category: "optimization",
      savings: "Est. 35-40% energy reduction",
    },
    {
      id: "2",
      title: "Optimize Batch Size",
      description:
        "Current batch size is suboptimal. Increasing can improve GPU utilization and reduce total training time.",
      impact: "medium" as const,
      category: "efficiency",
      savings: "Est. 20-25% faster training",
    },
  ];

  return (
    <div className="p-4">
      <RecommendationsPanel
        recommendations={mockRecommendations}
        onApply={(id) => console.log("Applied:", id)}
      />
    </div>
  );
}
