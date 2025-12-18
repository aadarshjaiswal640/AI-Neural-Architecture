import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  suffix?: string;
  animated?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  suffix = "",
  animated = true,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated || typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animated]);

  const changeColor =
    changeType === "positive"
      ? "text-success"
      : changeType === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <Card className="p-6 hover-elevate">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground" data-testid={`stat-label-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </p>
          <div className="mt-2">
            <p className="text-3xl font-bold" data-testid={`stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {displayValue}
              {suffix}
            </p>
            {change && (
              <p className={`mt-1 text-sm ${changeColor}`} data-testid={`stat-change-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                {change}
              </p>
            )}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
