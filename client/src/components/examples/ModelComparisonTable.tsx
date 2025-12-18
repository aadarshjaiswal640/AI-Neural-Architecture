import { ModelComparisonTable } from "../ModelComparisonTable";

export default function ModelComparisonTableExample() {
  const mockModels = [
    {
      id: "1",
      name: "EfficientNet-B7",
      type: "CNN",
      accuracy: 94.2,
      energy: 28.5,
      flops: 37.8,
      efficiency: 4.8,
      carbonFootprint: 12.456,
    },
    {
      id: "2",
      name: "GPT-3-Small",
      type: "Transformer",
      accuracy: 95.8,
      energy: 65.2,
      flops: 125.4,
      efficiency: 3.2,
      carbonFootprint: 28.534,
    },
  ];

  return (
    <div className="p-4">
      <ModelComparisonTable models={mockModels} />
    </div>
  );
}
