import { StatCard } from "@/components/StatCard";
import { EnergyHistogram } from "@/components/EnergyHistogram";
import { ModelAccuracyChart } from "@/components/ModelAccuracyChart";
import { EnergyPieChart } from "@/components/EnergyPieChart";
import { FLOPsBoxplot } from "@/components/FLOPsBoxplot";
import { AccuracyEnergyScatter } from "@/components/AccuracyEnergyScatter";
import { ModelComparisonTable } from "@/components/ModelComparisonTable";
import {
  Zap,
  TrendingDown,
  Database,
  Leaf,
  Activity,
  BarChart3,
} from "lucide-react";
import { useStatistics, useChartData, useModels } from "@/hooks/useAnalysis";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStatistics();
  const { data: chartData, isLoading: chartsLoading } = useChartData();
  const { data: models, isLoading: modelsLoading } = useModels();

  const hasData = stats && chartData && models;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Neural Architecture Energy Footprint Analyzer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive analysis and insights into AI model energy consumption
          and sustainability
        </p>
      </div>

      {!hasData && !statsLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold mb-2">No Data Available</p>
          <p className="text-muted-foreground mb-4">
            Upload a dataset to begin analyzing AI model energy consumption
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Models"
              value={stats?.modelCount || 0}
              icon={BarChart3}
              change={stats?.modelCount ? `${stats.modelCount} analyzed` : ""}
              changeType="neutral"
            />
            <StatCard
              title="Avg Energy"
              value={stats?.meanEnergy.toFixed(1) || 0}
              icon={Zap}
              suffix=" kWh"
              change={stats?.stdDevEnergy ? `±${stats.stdDevEnergy.toFixed(1)} kWh` : ""}
              changeType="neutral"
            />
            <StatCard
              title="Model Types"
              value={chartData?.pie.labels.length || 0}
              icon={Database}
              change={stats?.modeModelType ? `Most common: ${stats.modeModelType}` : ""}
              changeType="neutral"
            />
            <StatCard
              title="CO₂ Footprint"
              value={stats?.totalCarbonFootprint.toFixed(1) || 0}
              icon={Leaf}
              suffix=" kg"
              change="Total emissions"
              changeType="neutral"
            />
            <StatCard
              title="Avg Efficiency"
              value={stats?.avgEfficiency.toFixed(1) || 0}
              icon={TrendingDown}
              suffix="/5"
              change={stats && stats.avgEfficiency >= 4 ? "Excellent" : "Needs improvement"}
              changeType={stats && stats.avgEfficiency >= 4 ? "positive" : "neutral"}
            />
            <StatCard
              title="Accuracy Range"
              value={`${stats?.minAccuracy.toFixed(0) || 0}-${stats?.maxAccuracy.toFixed(0) || 0}`}
              icon={Activity}
              suffix="%"
              change="Min-Max range"
              changeType="neutral"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <EnergyHistogram data={chartData?.histogram} />
            <ModelAccuracyChart data={chartData?.accuracy} />
            <EnergyPieChart data={chartData?.pie} />
            <FLOPsBoxplot data={chartData?.boxplot} />
          </div>

          <AccuracyEnergyScatter data={chartData?.scatter} />

          <ModelComparisonTable models={models} />
        </>
      )}
    </div>
  );
}
