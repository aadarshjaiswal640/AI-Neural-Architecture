import type { ModelData, InsertAIModel } from "@shared/schema";

export function parseCSV(content: string): ModelData[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV file must contain header and at least one data row");
  }

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  
  const requiredFields = ["model_name", "model_type", "accuracy", "energy_kwh", "flops_giga"];
  const missingFields = requiredFields.filter((field) => !header.includes(field));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required columns: ${missingFields.join(", ")}`);
  }

  const models: ModelData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length < header.length) continue;

    const model: ModelData = {
      model_name: values[header.indexOf("model_name")] || "",
      model_type: values[header.indexOf("model_type")] || "",
      accuracy: parseFloat(values[header.indexOf("accuracy")]) || 0,
      energy_kwh: parseFloat(values[header.indexOf("energy_kwh")]) || 0,
      flops_giga: parseFloat(values[header.indexOf("flops_giga")]) || 0,
    };

    const paramsIndex = header.indexOf("parameters_m");
    if (paramsIndex >= 0) {
      model.parameters_m = parseFloat(values[paramsIndex]) || undefined;
    }

    if (model.model_name && model.model_type && model.accuracy > 0) {
      models.push(model);
    }
  }

  return models;
}

export function calculateEfficiencyScore(
  accuracy: number,
  energyKwh: number,
  flopsGiga: number
): number {
  const normalizedAccuracy = accuracy / 100;
  const energyPenalty = 1 / (1 + Math.log10(energyKwh + 1));
  const flopsPenalty = 1 / (1 + Math.log10(flopsGiga + 1));
  
  const score = (normalizedAccuracy * 0.5 + energyPenalty * 0.3 + flopsPenalty * 0.2) * 5;
  
  return Math.min(5, Math.max(0, score));
}

export function calculateCarbonFootprint(energyKwh: number): number {
  const CO2_PER_KWH = 0.437;
  return energyKwh * CO2_PER_KWH;
}

export function enrichModelData(model: ModelData, datasetId: string): InsertAIModel {
  const efficiencyScore = calculateEfficiencyScore(
    model.accuracy,
    model.energy_kwh,
    model.flops_giga
  );
  const carbonFootprint = calculateCarbonFootprint(model.energy_kwh);

  return {
    datasetId,
    modelName: model.model_name,
    modelType: model.model_type,
    accuracy: model.accuracy,
    energyKwh: model.energy_kwh,
    flopsGiga: model.flops_giga,
    parametersM: model.parameters_m,
    efficiencyScore,
    carbonFootprint,
  };
}

export function generateSampleCSV(): string {
  const models = [
    { name: "EfficientNet-B7", type: "CNN", accuracy: 94.2, energy: 28.5, flops: 37.8, params: 66 },
    { name: "GPT-3-Small", type: "Transformer", accuracy: 95.8, energy: 65.2, flops: 125.4, params: 125 },
    { name: "ResNet-50", type: "CNN", accuracy: 92.4, energy: 22.1, flops: 25.6, params: 25 },
    { name: "BERT-Base", type: "Transformer", accuracy: 93.6, energy: 48.9, flops: 86.3, params: 110 },
    { name: "MobileNet-V3", type: "CNN", accuracy: 89.2, energy: 8.4, flops: 4.2, params: 5 },
    { name: "ViT-Base", type: "Transformer", accuracy: 94.8, energy: 52.3, flops: 92.7, params: 86 },
    { name: "ResNet-101", type: "CNN", accuracy: 93.8, energy: 35.6, flops: 44.5, params: 44 },
    { name: "LSTM-Large", type: "RNN", accuracy: 88.4, energy: 38.2, flops: 48.9, params: 45 },
    { name: "GPT-2-Medium", type: "Transformer", accuracy: 94.2, energy: 58.7, flops: 98.3, params: 345 },
    { name: "InceptionV3", type: "CNN", accuracy: 91.5, energy: 26.8, flops: 31.2, params: 24 },
  ];

  let csv = "model_name,model_type,accuracy,energy_kwh,flops_giga,parameters_m\n";
  
  models.forEach((m) => {
    csv += `${m.name},${m.type},${m.accuracy},${m.energy},${m.flops},${m.params}\n`;
  });

  return csv;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  savings: string;
}

export function generateRecommendations(
  avgEnergy: number,
  avgEfficiency: number,
  modelTypes: string[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (avgEnergy > 40) {
    recommendations.push({
      id: "quantization",
      title: "Implement Model Quantization",
      description:
        "Reduce model precision from FP32 to INT8 to decrease energy consumption by up to 40% while maintaining 98% accuracy. This technique is particularly effective for CNN-based models.",
      impact: "high",
      category: "optimization",
      savings: "Est. 35-40% energy reduction",
    });
  }

  if (avgEnergy > 30) {
    recommendations.push({
      id: "batch-size",
      title: "Optimize Batch Size",
      description:
        "Current batch size may be suboptimal. Increasing batch size can improve GPU utilization and reduce total training time by 25%, leading to significant energy savings.",
      impact: "high",
      category: "efficiency",
      savings: "Est. 20-25% faster training",
    });
  }

  recommendations.push({
    id: "mixed-precision",
    title: "Enable Mixed Precision Training",
    description:
      "Use automatic mixed precision (AMP) to train models faster while consuming less memory and energy. Compatible with most modern GPUs and frameworks.",
    impact: "medium",
    category: "configuration",
    savings: "Est. 15-20% energy reduction",
  });

  if (avgEfficiency < 4.0) {
    recommendations.push({
      id: "pruning",
      title: "Prune Redundant Connections",
      description:
        "Remove 30-50% of neural network connections with minimal impact on accuracy. This reduces FLOPs and energy consumption during both training and inference.",
      impact: "high",
      category: "reduction",
      savings: "Est. 30-35% fewer FLOPs",
    });
  }

  recommendations.push({
    id: "scheduling",
    title: "Schedule Training During Off-Peak Hours",
    description:
      "Running intensive training jobs during off-peak electricity hours (typically 10 PM - 6 AM) can reduce carbon footprint when renewable energy sources are more prevalent.",
    impact: "medium",
    category: "efficiency",
    savings: "Est. 10-15% carbon reduction",
  });

  if (modelTypes.includes("CNN") || modelTypes.includes("Transformer")) {
    recommendations.push({
      id: "hardware-kernels",
      title: "Use Hardware-Optimized Kernels",
      description:
        "Leverage hardware-specific optimizations like cuDNN for NVIDIA GPUs or TensorRT for inference. These can provide 2-3x speedups for certain operations.",
      impact: "medium",
      category: "hardware",
      savings: "Est. 40-60% faster inference",
    });
  }

  return recommendations;
}
