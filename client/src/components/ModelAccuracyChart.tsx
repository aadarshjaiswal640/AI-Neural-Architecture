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

interface ModelAccuracyChartProps {
  data?: {
    labels: string[];
    values: number[];
  };
}

export function ModelAccuracyChart({ data }: ModelAccuracyChartProps) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Average Accuracy (%)",
        data: data?.values || [],
        backgroundColor: "hsl(var(--chart-2) / 0.8)",
        borderColor: "hsl(var(--chart-2))",
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
        min: 0,
        max: 100,
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
        <h3 className="font-semibold">Model Type vs Average Accuracy</h3>
        <p className="text-sm text-muted-foreground">
          Comparison of accuracy across different model architectures
        </p>
      </div>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}
