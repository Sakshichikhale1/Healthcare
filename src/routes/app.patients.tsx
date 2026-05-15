import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Filter } from "lucide-react";
import { recentPatients } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/patients")({
  head: () => ({ meta: [{ title: "Patients · ClinicOS AI" }] }),
  component: Patients,
});

const riskTone: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/15 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const all = [
  ...recentPatients,
  { id: "P-10278", name: "Emma Wallace", age: 38, condition: "Asthma", risk: "low", status: "Scheduled" },
  { id: "P-10277", name: "Noah Garcia", age: 56, condition: "Coronary Artery Disease", risk: "high", status: "Consulting" },
  { id: "P-10276", name: "Olivia Brown", age: 24, condition: "Anxiety", risk: "low", status: "Follow-up" },
  { id: "P-10275", name: "Ethan Wilson", age: 62, condition: "COPD", risk: "high", status: "Consulting" },
];

function Patients() {
  const handleOpenChart = (name: string) => {
    toast.info(`Opening chart for ${name}`, {
      description: "Loading clinical history and active consultations...",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Patients" description="Manage your full patient roster.">
        <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Filters</Button>
        <Button size="sm" className="bg-gradient-primary"><Plus className="mr-1.5 h-3.5 w-3.5" /> New patient</Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, condition…" className="h-9 pl-9" />
        </div>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">All ({all.length})</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">High risk</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Active</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Scheduled</Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {all.map((p) => (
          <Card key={p.id} className="group p-4 transition hover:-translate-y-0.5 hover:shadow-elegant">
            <div className="flex items-start gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-gradient-primary text-sm text-primary-foreground">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <Badge variant="outline" className={riskTone[p.risk]}>{p.risk}</Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">{p.id} · {p.age}y</p>
                <p className="mt-2 truncate text-xs">{p.condition}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <Badge variant="secondary" className="text-[10px]">{p.status}</Badge>
              <Link to="/app/doctor" search={{ patientId: p.id }} onClick={() => handleOpenChart(p.name)}>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Open chart →</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
