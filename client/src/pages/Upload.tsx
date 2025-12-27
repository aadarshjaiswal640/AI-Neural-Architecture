import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisComplete(false);
    setProgress(0);
    setDatasetId(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the dataset
      const uploadResponse = await fetch("/api/upload-dataset", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadResult = await uploadResponse.json();
      const newDatasetId = uploadResult.datasetId;
      setDatasetId(newDatasetId);
      
      // Analyze the dataset
      setProgress(50);
      const analysisResponse = await fetch("/api/analyze-dataset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ datasetId: newDatasetId }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Analysis failed");
      }

      setProgress(100);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/charts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      
      toast({
        title: "Analysis Complete",
        description: "Your dataset has been successfully analyzed.",
      });
    } catch (error: any) {
      setIsAnalyzing(false);
      setProgress(0);
      toast({
        title: "Error",
        description: error.message || "Failed to process dataset",
        variant: "destructive",
      });
    }
  };

  const handleGenerateSample = async () => {
    try {
      const response = await fetch("/api/sample-dataset");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sample_ai_models.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Sample Downloaded",
        description: "Sample dataset has been downloaded to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download sample dataset",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Dataset</h1>
        <p className="mt-2 text-muted-foreground">
          Upload your CSV file containing AI model energy consumption data for
          analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FileUpload onFileSelect={handleFileSelect} />

          {file && !analysisComplete && (
            <Card className="mt-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Ready to Analyze</h3>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    data-testid="button-analyze"
                  >
                    {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                  </Button>
                </div>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing dataset...</span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </div>
            </Card>
          )}

          {analysisComplete && (
            <Card className="mt-6 p-6 border-success">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Analysis Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    Your dataset has been successfully processed. View results
                    in the Dashboard or Visualizations tabs.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleGenerateSample}
                data-testid="button-generate-sample"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Sample Dataset
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Requirements
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• CSV format only</li>
              <li>• Max file size: 50MB</li>
              <li>• Required columns: model_name, type, accuracy, energy, flops</li>
              <li>• Recommended: 10+ records</li>
            </ul>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">Expected Columns</h3>
            <div className="space-y-1 text-sm font-mono text-muted-foreground">
              <p>• model_name</p>
              <p>• model_type</p>
              <p>• accuracy (%)</p>
              <p>• energy_kwh</p>
              <p>• flops_giga</p>
              <p>• parameters_m (optional)</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
