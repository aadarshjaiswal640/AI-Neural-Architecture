import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ModelData {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  energy: number;
  flops: number;
  efficiency: number;
  carbonFootprint: number;
}

interface ModelComparisonTableProps {
  models?: ModelData[];
}

export function ModelComparisonTable({ models = [] }: ModelComparisonTableProps) {
  const getEfficiencyBadge = (score: number) => {
    if (score >= 4.5) return { variant: "default" as const, label: "Excellent" };
    if (score >= 3.5) return { variant: "secondary" as const, label: "Good" };
    if (score >= 2.5) return { variant: "outline" as const, label: "Fair" };
    return { variant: "destructive" as const, label: "Poor" };
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Model Efficiency Rankings</h3>
        <p className="text-sm text-muted-foreground">
          Comparative analysis of model performance and energy consumption
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Accuracy (%)</TableHead>
              <TableHead className="text-right">Energy (kWh)</TableHead>
              <TableHead className="text-right">FLOPs (G)</TableHead>
              <TableHead className="text-right">CO₂ (kg)</TableHead>
              <TableHead>Efficiency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              models.map((model) => {
                const badge = getEfficiencyBadge(model.efficiency);
                return (
                  <TableRow key={model.id} data-testid={`row-model-${model.id}`}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.type}</TableCell>
                    <TableCell className="text-right">{model.accuracy.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{model.energy.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{model.flops.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{model.carbonFootprint.toFixed(3)}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant} data-testid={`badge-efficiency-${model.id}`}>
                        {badge.label} ({model.efficiency.toFixed(1)})
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
