import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const datasets = pgTable("datasets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  recordCount: integer("record_count").notNull(),
  status: text("status").notNull().default("processing"),
});

export const aiModels = pgTable("ai_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  datasetId: varchar("dataset_id").notNull(),
  modelName: text("model_name").notNull(),
  modelType: text("model_type").notNull(),
  accuracy: real("accuracy").notNull(),
  energyKwh: real("energy_kwh").notNull(),
  flopsGiga: real("flops_giga").notNull(),
  parametersM: real("parameters_m"),
  efficiencyScore: real("efficiency_score"),
  carbonFootprint: real("carbon_footprint"),
});

export const analysisResults = pgTable("analysis_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  datasetId: varchar("dataset_id").notNull().unique(),
  meanEnergy: real("mean_energy").notNull(),
  medianParameters: real("median_parameters"),
  modeModelType: text("mode_model_type"),
  minAccuracy: real("min_accuracy").notNull(),
  maxAccuracy: real("max_accuracy").notNull(),
  minFlops: real("min_flops").notNull(),
  maxFlops: real("max_flops").notNull(),
  stdDevEnergy: real("std_dev_energy").notNull(),
  avgEfficiency: real("avg_efficiency").notNull(),
  totalCarbonFootprint: real("total_carbon_footprint").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  uploadedAt: true,
});

export const insertAIModelSchema = createInsertSchema(aiModels).omit({
  id: true,
});

export const insertAnalysisResultsSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type AIModel = typeof aiModels.$inferSelect;
export type InsertAIModel = z.infer<typeof insertAIModelSchema>;
export type AnalysisResults = typeof analysisResults.$inferSelect;
export type InsertAnalysisResults = z.infer<typeof insertAnalysisResultsSchema>;

export interface ModelData {
  model_name: string;
  model_type: string;
  accuracy: number;
  energy_kwh: number;
  flops_giga: number;
  parameters_m?: number;
}

export interface Statistics {
  meanEnergy: number;
  medianParameters: number;
  modeModelType: string;
  minAccuracy: number;
  maxAccuracy: number;
  minFlops: number;
  maxFlops: number;
  stdDevEnergy: number;
  avgEfficiency: number;
  totalCarbonFootprint: number;
  modelCount: number;
}

export interface ChartData {
  histogram: {
    labels: string[];
    values: number[];
  };
  accuracy: {
    labels: string[];
    values: number[];
  };
  pie: {
    labels: string[];
    values: number[];
  };
  boxplot: {
    labels: string[];
    min: number[];
    max: number[];
    median: number[];
    q1: number[];
    q3: number[];
  };
  scatter: {
    datasets: Array<{
      label: string;
      data: Array<{ x: number; y: number }>;
      color: string;
    }>;
  };
}
