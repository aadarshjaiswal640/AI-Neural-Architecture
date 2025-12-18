import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface AccuracyEnergyScatterProps {
  data?: {
    datasets: Array<{
      label: string;
      data: Array<{ x: number; y: number }>;
      color: string;
    }>;
  };
}

export function AccuracyEnergyScatter({ data }: AccuracyEnergyScatterProps) {
  const chartData = {
    datasets:
      data?.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: `hsl(var(--chart-${(index % 5) + 1}) / 0.6)`,
        borderColor: `hsl(var(--chart-${(index % 5) + 1}))`,
        pointRadius: 6,
        pointHoverRadius: 8,
      })) || [],
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
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: (${context.parsed.x.toFixed(2)}%, ${context.parsed.y.toFixed(2)} kWh)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Accuracy (%)",
          color: "hsl(var(--foreground))",
        },
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
        <h3 className="font-semibold">Accuracy vs Energy Consumption</h3>
        <p className="text-sm text-muted-foreground">
          Scatter plot colored by model type with efficiency trends
        </p>
      </div>
      <div className="h-[300px]">
        <Scatter data={chartData} options={options} />
      </div>
    </Card>
  );
}
