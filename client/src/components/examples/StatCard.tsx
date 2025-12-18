import { StatCard } from "../StatCard";
import { Zap } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-4 max-w-md">
      <StatCard
        title="Avg Energy"
        value={45.6}
        icon={Zap}
        suffix=" kWh"
        change="-8% reduction"
        changeType="positive"
      />
    </div>
  );
}
