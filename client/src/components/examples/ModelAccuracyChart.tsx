import { ModelAccuracyChart } from "../ModelAccuracyChart";

export default function ModelAccuracyChartExample() {
  const mockData = {
    labels: ["CNN", "Transformer", "RNN", "ResNet", "BERT"],
    values: [92.5, 94.8, 88.2, 93.6, 96.1],
  };

  return (
    <div className="p-4">
      <ModelAccuracyChart data={mockData} />
    </div>
  );
}
