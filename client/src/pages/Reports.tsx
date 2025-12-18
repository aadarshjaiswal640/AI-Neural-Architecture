import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Calendar, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStatistics, useModels } from "@/hooks/useAnalysis";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  const { toast } = useToast();
  const { data: stats } = useStatistics();
  const { data: models } = useModels();

  const handleGenerateReport = async (type: string) => {
    if (!stats || !models) {
      toast({
        title: "No Data Available",
        description: "Please upload and analyze a dataset first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      pdf.setFontSize(20);
      pdf.text(type, margin, 30);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 40);

      pdf.setFontSize(12);
      pdf.setTextColor(0);
      pdf.text("Statistical Summary", margin, 55);
      
      const stats_data = [
        ["Metric", "Value"],
        ["Total Models Analyzed", stats.modelCount.toString()],
        ["Average Energy Consumption", `${stats.meanEnergy.toFixed(2)} kWh`],
        ["Energy Standard Deviation", `${stats.stdDevEnergy.toFixed(2)} kWh`],
        ["Most Common Model Type", stats.modeModelType || "N/A"],
        ["Accuracy Range", `${stats.minAccuracy.toFixed(1)}% - ${stats.maxAccuracy.toFixed(1)}%`],
        ["FLOPs Range", `${stats.minFlops.toFixed(1)}G - ${stats.maxFlops.toFixed(1)}G`],
        ["Average Efficiency Score", `${stats.avgEfficiency.toFixed(2)}/5`],
        ["Total Carbon Footprint", `${stats.totalCarbonFootprint.toFixed(2)} kg CO₂`],
      ];

      let yPos = 65;
      stats_data.forEach((row, index) => {
        if (index === 0) {
          pdf.setFontSize(10);
          pdf.setFont(undefined, "bold");
        } else {
          pdf.setFont(undefined, "normal");
        }
        pdf.text(row[0], margin, yPos);
        pdf.text(row[1], margin + 100, yPos);
        yPos += 7;
      });

      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Top 5 Most Efficient Models", margin, yPos + 10);
      
      const topModels = [...models]
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, 5);

      yPos += 20;
      pdf.setFontSize(9);
      topModels.forEach((model, index) => {
        pdf.text(
          `${index + 1}. ${model.name} (${model.type}) - Efficiency: ${model.efficiency.toFixed(2)}/5`,
          margin,
          yPos
        );
        yPos += 6;
      });

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        "Neural Architecture Energy Footprint Analyzer",
        margin,
        pdf.internal.pageSize.getHeight() - 10
      );

      pdf.save(`${type.toLowerCase().replace(/\s+/g, "_")}_report.pdf`);

      toast({
        title: "Report Generated",
        description: `Your ${type} report has been downloaded.`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Documentation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Generate comprehensive PDF reports and sustainability certificates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 hover-elevate">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Comprehensive Analysis Report</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Full statistical analysis with all metrics, model comparisons,
            and detailed statistics
          </p>
          <Button
            className="w-full"
            onClick={() => handleGenerateReport("Comprehensive Analysis")}
            data-testid="button-generate-comprehensive"
            disabled={!stats}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
        </Card>

        <Card className="p-6 hover-elevate">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <TrendingDown className="h-6 w-6 text-success" />
          </div>
          <h3 className="font-semibold mb-2">Sustainability Certificate</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Official certificate documenting your carbon footprint reduction and
            efficiency improvements
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleGenerateReport("Sustainability Certificate")}
            data-testid="button-generate-certificate"
            disabled={!stats}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
        </Card>

        <Card className="p-6 hover-elevate">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
            <Calendar className="h-6 w-6 text-chart-2" />
          </div>
          <h3 className="font-semibold mb-2">Statistical Summary</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Aggregated statistics showing key metrics and efficiency scores
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleGenerateReport("Statistical Summary")}
            data-testid="button-generate-monthly"
            disabled={!stats}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
        </Card>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-2">What's Included?</h3>
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div>
            <h4 className="font-medium mb-2 text-sm">Analysis Report</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Statistical summaries</li>
              <li>• Energy consumption metrics</li>
              <li>• Model comparison data</li>
              <li>• Efficiency rankings</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm">Sustainability Report</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Carbon footprint analysis</li>
              <li>• Optimization recommendations</li>
              <li>• Environmental impact</li>
              <li>• Improvement suggestions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
