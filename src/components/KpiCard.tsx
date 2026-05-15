import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KpiProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
  accent?: "primary" | "teal" | "success" | "warning";
}

const accentMap = {
  primary: "from-primary/10 to-primary/0 text-primary",
  teal: "from-teal/15 to-teal/0 text-teal-foreground",
  success: "from-success/15 to-success/0 text-success",
  warning: "from-warning/15 to-warning/0 text-warning",
};

export function KpiCard({ label, value, change, trend = "up", icon, accent = "primary" }: KpiProps) {
  return (
    <Card className="group relative overflow-hidden border-border/60 p-5 transition-all hover:shadow-elegant hover:-translate-y-0.5">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-60",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {change && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
                trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg border border-border/80 bg-background/80 p-2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
