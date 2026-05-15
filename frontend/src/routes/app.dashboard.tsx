import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Stethoscope,
  Bot,
  DollarSign,
  Calendar,
  Bell,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  kpis,
  appointmentTrend,
  revenueData,
  claimRisk,
  recentPatients,
  agentLog,
  upcomingAppointments,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · ClinicOS AI" }] }),
  component: Dashboard,
});

const riskTone: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/15 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

import { AnalyticsService } from "@/services/api";
import { useEffect, useState } from "react";

function Dashboard() {
  const [dashboardKpis, setDashboardKpis] = useState(kpis);
  const icons = [Users, Stethoscope, Bot, DollarSign];
  const accents = ["primary", "teal", "primary", "success"] as const;

  useEffect(() => {
    AnalyticsService.getKpis().then((res) => {
      if (res && res.length > 0) {
        // Map backend KPIs to frontend structure
        const mapped = kpis.map(k => {
          const apiKpi = res.find((r: any) => r.metric_name.toLowerCase().includes(k.label.toLowerCase()));
          if (apiKpi) {
            return { ...k, value: apiKpi.metric_value.toString() };
          }
          return k;
        });
        setDashboardKpis(mapped);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Clinic Operations" description="Live overview of your clinic, agents, and revenue.">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => toast.success("Timeline range updated to last 7 days")}
        >
          Last 7 days
        </Button>
        <Button 
          size="sm" 
          className="bg-gradient-primary"
          onClick={() => toast.info("Initializing AI Agent Assistant...")}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Ask AI
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((k, i) => {
          const Icon = icons[i] || Users;
          return <KpiCard key={k.label} {...k} icon={<Icon className="h-4 w-4" />} accent={accents[i] || "primary"} />;
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Appointment trends</h3>
              <p className="text-xs text-muted-foreground">AI-assisted vs total bookings</p>
            </div>
            <Badge variant="secondary">This week</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appointmentTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-teal)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-teal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="appointments" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="ai" stroke="var(--color-teal)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Insurance claim risk</h3>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={claimRisk} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {claimRisk.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg approval rate</span>
              <span className="font-semibold text-success">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Predicted denials</span>
              <span className="font-semibold">$48,230</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Revenue analytics</h3>
              <p className="text-xs text-muted-foreground">Monthly revenue vs claim collections</p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">+18.7%</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="claims" fill="var(--color-teal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Upcoming appointments</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((a) => (
              <div key={a.time} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                <div className="flex h-9 w-12 flex-col items-center justify-center rounded-md bg-secondary text-[10px] font-semibold text-foreground">
                  {a.time}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{a.patient}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.doctor} · {a.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent patients</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="space-y-2">
            {recentPatients.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-2.5 transition hover:bg-secondary/50">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-primary text-xs text-primary-foreground">
                    {p.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.id} · {p.age}y · {p.condition}</p>
                </div>
                <Badge variant="outline" className={riskTone[p.risk]}>{p.risk}</Badge>
                <span className="hidden text-xs text-muted-foreground sm:inline">{p.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">AI agent activity</h3>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {agentLog.slice(0, 6).map((l) => (
              <div key={l.time} className="relative pl-5">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-gradient-primary" />
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold">{l.agent}</span>
                  <span className="text-[10px] text-muted-foreground">{l.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{l.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-gradient-primary/10 p-3">
            <p className="text-xs font-semibold">Follow-up completion rate</p>
            <Progress value={92} className="mt-2 h-1.5" />
            <p className="mt-1.5 text-[10px] text-muted-foreground">92% adherence · target 90%</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
