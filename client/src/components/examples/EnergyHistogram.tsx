import { EnergyHistogram } from "../EnergyHistogram";

export default function EnergyHistogramExample() {
  const mockData = {
    labels: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60+"],
    values: [15, 32, 45, 38, 25, 18, 12],
  };

  return (
    <div className="p-4">
      <EnergyHistogram data={mockData} />
    </div>
  );
}
