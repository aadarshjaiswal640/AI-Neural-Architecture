import { EnergyHistogram } from "@/components/EnergyHistogram";
import { ModelAccuracyChart } from "@/components/ModelAccuracyChart";
import { EnergyPieChart } from "@/components/EnergyPieChart";
import { FLOPsBoxplot } from "@/components/FLOPsBoxplot";
import { AccuracyEnergyScatter } from "@/components/AccuracyEnergyScatter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChartData } from "@/hooks/useAnalysis";

export default function Visualizations() {
  const { data: chartData, isLoading } = useChartData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading visualizations...</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold mb-2">No Data Available</p>
        <p className="text-muted-foreground">
          Upload a dataset to see interactive visualizations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Interactive Visualizations
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore your AI model data through comprehensive charts and graphs
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-charts">
            All Charts
          </TabsTrigger>
          <TabsTrigger value="distribution" data-testid="tab-distribution">
            Distribution
          </TabsTrigger>
          <TabsTrigger value="comparison" data-testid="tab-comparison">
            Comparison
          </TabsTrigger>
          <TabsTrigger value="correlation" data-testid="tab-correlation">
            Correlation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <EnergyHistogram data={chartData.histogram} />
            <ModelAccuracyChart data={chartData.accuracy} />
            <EnergyPieChart data={chartData.pie} />
            <FLOPsBoxplot data={chartData.boxplot} />
          </div>
          <AccuracyEnergyScatter data={chartData.scatter} />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <EnergyHistogram data={chartData.histogram} />
            <EnergyPieChart data={chartData.pie} />
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ModelAccuracyChart data={chartData.accuracy} />
            <FLOPsBoxplot data={chartData.boxplot} />
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <AccuracyEnergyScatter data={chartData.scatter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
