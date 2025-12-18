import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from "multer";
import { storage } from "./storage";
import {
  parseCSV,
  enrichModelData,
  generateSampleCSV,
  generateRecommendations,
} from "./analysis";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/upload-dataset", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString("utf-8");
      const models = parseCSV(fileContent);

      const dataset = await storage.createDataset({
        filename: req.file.originalname,
        recordCount: models.length,
        status: "pending",
      });

      for (const model of models) {
        const enrichedModel = enrichModelData(model, dataset.id);
        await storage.createAIModel(enrichedModel);
      }

      res.json({
        success: true,
        datasetId: dataset.id,
        recordCount: models.length,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json(datasets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/statistics/:datasetId?", async (req, res) => {
    try {
      let stats;
      if (req.params.datasetId) {
        stats = await storage.calculateStatistics(req.params.datasetId);
      } else {
        const analysis = await storage.getLatestAnalysis();
        if (analysis) {
          const models = await storage.getModelsByDataset(analysis.datasetId);
          stats = {
            meanEnergy: analysis.meanEnergy,
            medianParameters: analysis.medianParameters || 0,
            modeModelType: analysis.modeModelType || "Unknown",
            minAccuracy: analysis.minAccuracy,
            maxAccuracy: analysis.maxAccuracy,
            minFlops: analysis.minFlops,
            maxFlops: analysis.maxFlops,
            stdDevEnergy: analysis.stdDevEnergy,
            avgEfficiency: analysis.avgEfficiency,
            totalCarbonFootprint: analysis.totalCarbonFootprint,
            modelCount: models.length,
          };
        }
      }

      if (!stats) {
        return res.status(404).json({ error: "No statistics available" });
      }

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/charts/:datasetId?", async (req, res) => {
    try {
      let chartData;
      if (req.params.datasetId) {
        chartData = await storage.generateChartData(req.params.datasetId);
      } else {
        const datasets = await storage.getAllDatasets();
        if (datasets.length > 0) {
          const latest = datasets.sort(
            (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
          )[0];
          chartData = await storage.generateChartData(latest.id);
        }
      }

      if (!chartData) {
        return res.status(404).json({ error: "No chart data available" });
      }

      res.json(chartData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/models/:datasetId?", async (req, res) => {
    try {
      let models;
      if (req.params.datasetId) {
        models = await storage.getModelsByDataset(req.params.datasetId);
      } else {
        models = await storage.getAllModels();
      }

      const formattedModels = models.map((m) => ({
        id: m.id,
        name: m.modelName,
        type: m.modelType,
        accuracy: m.accuracy,
        energy: m.energyKwh,
        flops: m.flopsGiga,
        efficiency: m.efficiencyScore || 0,
        carbonFootprint: m.carbonFootprint || 0,
      }));

      res.json(formattedModels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/recommendations", async (req, res) => {
    try {
      const analysis = await storage.getLatestAnalysis();
      if (!analysis) {
        return res.json([]);
      }

      const models = await storage.getAllModels();
      const modelTypes = Array.from(new Set(models.map((m) => m.modelType)));

      const recommendations = generateRecommendations(
        analysis.meanEnergy,
        analysis.avgEfficiency,
        modelTypes
      );

      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sample-dataset", (req, res) => {
    try {
      const csv = generateSampleCSV();
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="sample_ai_models.csv"'
      );
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("analyze-dataset", async (datasetId: string) => {
      try {
        await storage.updateDatasetStatus(datasetId, "processing");
        socket.emit("analysis-progress", { progress: 10, message: "Loading dataset..." });

        const models = await storage.getModelsByDataset(datasetId);
        socket.emit("analysis-progress", { progress: 30, message: "Calculating statistics..." });

        const stats = await storage.calculateStatistics(datasetId);
        if (stats) {
          await storage.createAnalysisResults({
            datasetId: datasetId,
            meanEnergy: stats.meanEnergy,
            medianParameters: stats.medianParameters,
            modeModelType: stats.modeModelType,
            minAccuracy: stats.minAccuracy,
            maxAccuracy: stats.maxAccuracy,
            minFlops: stats.minFlops,
            maxFlops: stats.maxFlops,
            stdDevEnergy: stats.stdDevEnergy,
            avgEfficiency: stats.avgEfficiency,
            totalCarbonFootprint: stats.totalCarbonFootprint,
          });
        }
        socket.emit("analysis-progress", { progress: 60, message: "Generating charts..." });

        const chartData = await storage.generateChartData(datasetId);
        socket.emit("analysis-progress", { progress: 90, message: "Finalizing..." });

        await storage.updateDatasetStatus(datasetId, "completed");

        socket.emit("analysis-complete", {
          stats,
          chartData,
          modelCount: models.length,
        });
      } catch (error: any) {
        console.error("Analysis error:", error);
        socket.emit("analysis-error", { error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return httpServer;
}
