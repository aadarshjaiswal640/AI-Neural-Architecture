import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

interface EnergyPieChartProps {
  data?: {
    labels: string[];
    values: number[];
  };
}

export function EnergyPieChart({ data }: EnergyPieChartProps) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: data?.values || [],
        backgroundColor: [
          "hsl(var(--chart-1) / 0.8)",
          "hsl(var(--chart-2) / 0.8)",
          "hsl(var(--chart-3) / 0.8)",
          "hsl(var(--chart-4) / 0.8)",
          "hsl(var(--chart-5) / 0.8)",
        ],
        borderColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(var(--foreground))",
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
      },
    },
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Energy Usage by Architecture</h3>
        <p className="text-sm text-muted-foreground">
          Proportion of total energy consumption by model type
        </p>
      </div>
      <div className="h-[350px]">
        <Pie data={chartData} options={options} />
      </div>
    </Card>
  );
}
