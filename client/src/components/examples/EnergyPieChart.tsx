import { EnergyPieChart } from "../EnergyPieChart";

export default function EnergyPieChartExample() {
  const mockData = {
    labels: ["CNN", "Transformer", "ResNet", "BERT", "Others"],
    values: [850, 1200, 680, 950, 420],
  };

  return (
    <div className="p-4">
      <EnergyPieChart data={mockData} />
    </div>
  );
}
