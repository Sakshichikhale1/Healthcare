import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { revenueData, appointmentTrend, claimRisk, followupAdherence } from "@/lib/mock-data";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · ClinicOS AI" }] }),
  component: Analytics,
});

const heatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 12 }, (_, h) => Math.floor(Math.random() * 100)),
);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

import { AnalyticsService } from "@/services/api";
import { useEffect, useState } from "react";

function Analytics() {
  const [analyticsKpis, setAnalyticsKpis] = useState([
    { label: "Patient growth", value: "+24.6%", accent: "primary" as const },
    { label: "AI hours saved", value: "1,284", change: "+18%", accent: "teal" as const },
    { label: "Revenue / visit", value: "$284", change: "+11%", accent: "success" as const },
    { label: "Operational efficiency", value: "94%", change: "+4%", accent: "warning" as const },
  ]);

  useEffect(() => {
    AnalyticsService.getKpis().then((res) => {
      if (res && res.length > 0) {
        setAnalyticsKpis(prev => prev.map(k => {
          const apiKpi = res.find((r: any) => r.metric_name.toLowerCase().includes(k.label.toLowerCase()));
          if (apiKpi) {
            return { ...k, value: apiKpi.metric_value.toString() };
          }
          return k;
        }));
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Operational, financial, and clinical intelligence.">
        <Button variant="outline" size="sm">Last 30 days</Button>
        <Button size="sm" variant="outline">Export</Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map(k => (
          <KpiCard key={k.label} {...k} icon={k.label === "Patient growth" ? <Users className="h-4 w-4" /> : k.label === "AI hours saved" ? <Clock className="h-4 w-4" /> : k.label === "Revenue / visit" ? <DollarSign className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Patient growth</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={revenueData.map((d, i) => ({ month: d.month, patients: 800 + i * 220 }))}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="patients" stroke="var(--color-primary)" fill="url(#ag)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Revenue trends</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--color-teal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Follow-up adherence</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={followupAdherence}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="adherence" stroke="var(--color-success)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Claim risk distribution</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={claimRisk} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {claimRisk.map((c) => (<Cell key={c.name} fill={c.color} />))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold">Consultation heatmap</h3>
        <p className="mb-4 text-xs text-muted-foreground">Visits by day & hour</p>
        <div className="space-y-1">
          <div className="ml-10 grid grid-cols-12 gap-1 text-[10px] text-muted-foreground">
            {Array.from({ length: 12 }, (_, h) => (<div key={h} className="text-center">{h + 8}</div>))}
          </div>
          {heatmap.map((row, di) => (
            <div key={di} className="flex items-center gap-2">
              <div className="w-8 text-[10px] text-muted-foreground">{days[di]}</div>
              <div className="grid flex-1 grid-cols-12 gap-1">
                {row.map((v, hi) => (
                  <div
                    key={hi}
                    className="aspect-square rounded-sm"
                    style={{ background: `oklch(0.55 0.18 250 / ${0.08 + (v / 100) * 0.8})` }}
                    title={`${v} visits`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold">AI automation savings</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <AreaChart data={appointmentTrend.map((a) => ({ ...a, savings: a.ai * 6 }))}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-teal)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-teal)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="savings" stroke="var(--color-teal)" fill="url(#sg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
