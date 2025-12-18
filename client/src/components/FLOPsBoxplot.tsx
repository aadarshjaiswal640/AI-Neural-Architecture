import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FLOPsBoxplotProps {
  data?: {
    labels: string[];
    min: number[];
    max: number[];
    median: number[];
    q1: number[];
    q3: number[];
  };
}

export function FLOPsBoxplot({ data }: FLOPsBoxplotProps) {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Max",
        data: data?.max || [],
        borderColor: "hsl(var(--chart-4))",
        backgroundColor: "hsl(var(--chart-4) / 0.1)",
        tension: 0.4,
      },
      {
        label: "Q3",
        data: data?.q3 || [],
        borderColor: "hsl(var(--chart-3))",
        backgroundColor: "hsl(var(--chart-3) / 0.1)",
        tension: 0.4,
      },
      {
        label: "Median",
        data: data?.median || [],
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsl(var(--chart-1) / 0.1)",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Q1",
        data: data?.q1 || [],
        borderColor: "hsl(var(--chart-3))",
        backgroundColor: "hsl(var(--chart-3) / 0.1)",
        tension: 0.4,
      },
      {
        label: "Min",
        data: data?.min || [],
        borderColor: "hsl(var(--chart-4))",
        backgroundColor: "hsl(var(--chart-4) / 0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(var(--foreground))",
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
        title: {
          display: true,
          text: "Energy (kWh)",
          color: "hsl(var(--foreground))",
        },
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
        <h3 className="font-semibold">FLOPs vs Energy Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Energy consumption distribution with outlier identification
        </p>
      </div>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
