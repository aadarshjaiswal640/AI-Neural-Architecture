import {
  type Dataset,
  type InsertDataset,
  type AIModel,
  type InsertAIModel,
  type AnalysisResults,
  type InsertAnalysisResults,
  type Statistics,
  type ChartData,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Dataset operations
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  getDataset(id: string): Promise<Dataset | undefined>;
  getAllDatasets(): Promise<Dataset[]>;
  updateDatasetStatus(id: string, status: string): Promise<void>;

  // AI Model operations
  createAIModel(model: InsertAIModel): Promise<AIModel>;
  getModelsByDataset(datasetId: string): Promise<AIModel[]>;
  getAllModels(): Promise<AIModel[]>;

  // Analysis results operations
  createAnalysisResults(results: InsertAnalysisResults): Promise<AnalysisResults>;
  getAnalysisResults(datasetId: string): Promise<AnalysisResults | undefined>;
  getLatestAnalysis(): Promise<AnalysisResults | undefined>;

  // Statistics and charts
  calculateStatistics(datasetId: string): Promise<Statistics | undefined>;
  generateChartData(datasetId: string): Promise<ChartData | undefined>;
}

export class MemStorage implements IStorage {
  private datasets: Map<string, Dataset>;
  private aiModels: Map<string, AIModel>;
  private analysisResults: Map<string, AnalysisResults>;

  constructor() {
    this.datasets = new Map();
    this.aiModels = new Map();
    this.analysisResults = new Map();
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = randomUUID();
    const dataset: Dataset = {
      ...insertDataset,
      id,
      uploadedAt: new Date(),
      status: insertDataset.status || "processing",
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async getAllDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values());
  }

  async updateDatasetStatus(id: string, status: string): Promise<void> {
    const dataset = this.datasets.get(id);
    if (dataset) {
      dataset.status = status;
      this.datasets.set(id, dataset);
    }
  }

  async createAIModel(insertModel: InsertAIModel): Promise<AIModel> {
    const id = randomUUID();
    const model: AIModel = {
      ...insertModel,
      id,
      parametersM: insertModel.parametersM ?? null,
      efficiencyScore: insertModel.efficiencyScore ?? null,
      carbonFootprint: insertModel.carbonFootprint ?? null,
    };
    this.aiModels.set(id, model);
    return model;
  }

  async getModelsByDataset(datasetId: string): Promise<AIModel[]> {
    return Array.from(this.aiModels.values()).filter(
      (model) => model.datasetId === datasetId
    );
  }

  async getAllModels(): Promise<AIModel[]> {
    return Array.from(this.aiModels.values());
  }

  async createAnalysisResults(insertResults: InsertAnalysisResults): Promise<AnalysisResults> {
    const id = randomUUID();
    const results: AnalysisResults = {
      ...insertResults,
      id,
      createdAt: new Date(),
      medianParameters: insertResults.medianParameters ?? null,
      modeModelType: insertResults.modeModelType ?? null,
    };
    this.analysisResults.set(id, results);
    return results;
  }

  async getAnalysisResults(datasetId: string): Promise<AnalysisResults | undefined> {
    return Array.from(this.analysisResults.values()).find(
      (result) => result.datasetId === datasetId
    );
  }

  async getLatestAnalysis(): Promise<AnalysisResults | undefined> {
    const results = Array.from(this.analysisResults.values());
    if (results.length === 0) return undefined;
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }

  async calculateStatistics(datasetId: string): Promise<Statistics | undefined> {
    const models = await this.getModelsByDataset(datasetId);
    if (models.length === 0) return undefined;

    const energies = models.map((m) => m.energyKwh);
    const parameters = models.map((m) => m.parametersM || 0).filter((p) => p > 0);
    const accuracies = models.map((m) => m.accuracy);
    const flops = models.map((m) => m.flopsGiga);
    const efficiencies = models.map((m) => m.efficiencyScore || 0).filter((e) => e > 0);

    const meanEnergy = energies.reduce((a, b) => a + b, 0) / energies.length;
    const medianParameters = parameters.length > 0 ? this.median(parameters) : 0;
    const modeModelType = this.mode(models.map((m) => m.modelType));
    const minAccuracy = Math.min(...accuracies);
    const maxAccuracy = Math.max(...accuracies);
    const minFlops = Math.min(...flops);
    const maxFlops = Math.max(...flops);
    const stdDevEnergy = this.standardDeviation(energies);
    const avgEfficiency = efficiencies.length > 0 
      ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length 
      : 0;
    const totalCarbonFootprint = models
      .map((m) => m.carbonFootprint || 0)
      .reduce((a, b) => a + b, 0);

    return {
      meanEnergy,
      medianParameters,
      modeModelType,
      minAccuracy,
      maxAccuracy,
      minFlops,
      maxFlops,
      stdDevEnergy,
      avgEfficiency,
      totalCarbonFootprint,
      modelCount: models.length,
    };
  }

  async generateChartData(datasetId: string): Promise<ChartData | undefined> {
    const models = await this.getModelsByDataset(datasetId);
    if (models.length === 0) return undefined;

    // Histogram: Energy distribution
    const energyRanges = ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60+"];
    const histogram = {
      labels: energyRanges,
      values: energyRanges.map((_, i) => {
        const min = i * 10;
        const max = i === 6 ? Infinity : (i + 1) * 10;
        return models.filter((m) => m.energyKwh >= min && m.energyKwh < max).length;
      }),
    };

    // Bar chart: Model type vs average accuracy
    const modelTypes = Array.from(new Set(models.map((m) => m.modelType)));
    const accuracy = {
      labels: modelTypes,
      values: modelTypes.map((type) => {
        const typeModels = models.filter((m) => m.modelType === type);
        return typeModels.reduce((sum, m) => sum + m.accuracy, 0) / typeModels.length;
      }),
    };

    // Pie chart: Energy by architecture
    const pie = {
      labels: modelTypes,
      values: modelTypes.map((type) => {
        return models
          .filter((m) => m.modelType === type)
          .reduce((sum, m) => sum + m.energyKwh, 0);
      }),
    };

    // Boxplot: FLOPs vs Energy
    const boxplot = {
      labels: modelTypes,
      min: modelTypes.map((type) => {
        const energies = models.filter((m) => m.modelType === type).map((m) => m.energyKwh);
        return Math.min(...energies);
      }),
      max: modelTypes.map((type) => {
        const energies = models.filter((m) => m.modelType === type).map((m) => m.energyKwh);
        return Math.max(...energies);
      }),
      median: modelTypes.map((type) => {
        const energies = models.filter((m) => m.modelType === type).map((m) => m.energyKwh);
        return this.median(energies);
      }),
      q1: modelTypes.map((type) => {
        const energies = models.filter((m) => m.modelType === type).map((m) => m.energyKwh);
        return this.quartile(energies, 0.25);
      }),
      q3: modelTypes.map((type) => {
        const energies = models.filter((m) => m.modelType === type).map((m) => m.energyKwh);
        return this.quartile(energies, 0.75);
      }),
    };

    // Scatter: Accuracy vs Energy
    const scatter = {
      datasets: modelTypes.map((type) => ({
        label: type,
        data: models
          .filter((m) => m.modelType === type)
          .map((m) => ({ x: m.accuracy, y: m.energyKwh })),
        color: "",
      })),
    };

    return { histogram, accuracy, pie, boxplot, scatter };
  }

  private median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private quartile(values: number[], q: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  }

  private mode(values: string[]): string {
    const frequency: Record<string, number> = {};
    values.forEach((val) => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    let maxFreq = 0;
    let modeValue = values[0];
    Object.entries(frequency).forEach(([val, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        modeValue = val;
      }
    });
    return modeValue;
  }

  private standardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
}

export const storage = new MemStorage();
