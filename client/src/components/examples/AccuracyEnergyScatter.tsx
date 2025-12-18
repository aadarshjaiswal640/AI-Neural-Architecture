import { AccuracyEnergyScatter } from "../AccuracyEnergyScatter";

export default function AccuracyEnergyScatterExample() {
  const mockData = {
    datasets: [
      {
        label: "CNN",
        data: [
          { x: 91.2, y: 28.5 },
          { x: 92.8, y: 32.1 },
          { x: 90.5, y: 25.8 },
        ],
        color: "hsl(var(--chart-1))",
      },
      {
        label: "Transformer",
        data: [
          { x: 94.5, y: 52.3 },
          { x: 95.2, y: 58.7 },
          { x: 93.8, y: 48.2 },
        ],
        color: "hsl(var(--chart-2))",
      },
    ],
  };

  return (
    <div className="p-4">
      <AccuracyEnergyScatter data={mockData} />
    </div>
  );
}
