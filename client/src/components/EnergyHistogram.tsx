import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EnergyHistogramProps {
  data?: {
    labels: string[];
    values: number[];
  };
}

export function EnergyHistogram({ data }: EnergyHistogramProps) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Frequency",
        data: data?.values || [],
        backgroundColor: "hsl(var(--chart-1) / 0.8)",
        borderColor: "hsl(var(--chart-1))",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "hsl(var(--border) / 0.2)",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
      y: {
        grid: {
          color: "hsl(var(--border) / 0.2)",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Energy Consumption Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Histogram showing frequency of energy consumption levels
        </p>
      </div>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}
