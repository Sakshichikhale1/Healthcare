import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AgentService } from "@/services/api";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Stethoscope, CreditCard, Bell, Brain, BarChart3, Sparkles, Activity, Pause, Play } from "lucide-react";
import { agents as defaultAgents, agentLog as defaultLogs } from "@/lib/mock-data";

export const Route = createFileRoute("/app/agents")({
  head: () => ({ meta: [{ title: "AI Agent Console · ClinicOS AI" }] }),
  component: AgentConsole,
});

const iconMap: Record<string, typeof Bot> = {
  intake: Bot,
  scribe: Stethoscope,
  billing: CreditCard,
  followup: Bell,
  clinical: Brain,
  analytics: BarChart3,
};

const queue = [
  { task: "Code claim CL-88422", agent: "Billing", priority: "high" },
  { task: "Transcribe consultation #4893", agent: "Scribe", priority: "high" },
  { task: "Send 28 medication reminders", agent: "Follow-Up", priority: "medium" },
  { task: "Analyze Q3 referral patterns", agent: "Analytics", priority: "low" },
  { task: "Risk score patient P-10285", agent: "Clinical", priority: "medium" },
];

function AgentConsole() {
  const [agents, setAgents] = useState(defaultAgents);
  const [logs, setLogs] = useState(defaultLogs);

  useEffect(() => {
    // Fetch logs and status initially
    const fetchData = async () => {
      try {
        const [logsRes, statusRes] = await Promise.all([
          AgentService.getLogs(),
          AgentService.getStatus()
        ]);

        if (logsRes && logsRes.length > 0) {
          setLogs(logsRes.map((r: any) => ({
            time: new Date(r.created_at).toLocaleTimeString(),
            agent: r.agent_name,
            message: r.action
          })));
        }

        if (statusRes) {
          setAgents((prev) => prev.map(a => {
            const agentKey = a.id.toLowerCase();
            if (statusRes[agentKey]) {
              return { 
                ...a, 
                status: statusRes[agentKey].status, 
                task: statusRes[agentKey].task 
              };
            }
            return a;
          }));
        }
      } catch (e) {
        console.error("Error fetching agent data", e);
      }
    };

    fetchData();

    // WebSocket for realtime updates
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => console.log("Connected to Agent WebSocket");
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "agent_update") {
          setAgents((prev) => prev.map(a => 
            a.id.toLowerCase() === data.data.agent_name.toLowerCase()
              ? { ...a, status: data.data.status, task: data.data.task, progress: Math.floor(Math.random() * 100) }
              : a
          ));
          
          // Add to logs if it's a new action
          setLogs(prev => [{
            time: new Date().toLocaleTimeString(),
            agent: data.data.agent_name,
            message: data.data.task
          }, ...prev].slice(0, 20));
        }
      } catch (e) {
        console.error("WS message error", e);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="AI Agent Console" description="Real-time orchestration across your healthcare AI workforce.">
        <Badge className="border-success/30 bg-success/10 text-success">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          6 agents online
        </Badge>
        <Button size="sm" variant="outline"><Pause className="mr-1.5 h-3.5 w-3.5" /> Pause all</Button>
        <Button size="sm" className="bg-gradient-primary"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Deploy agent</Button>
      </PageHeader>

      {/* Workflow graph */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Orchestration graph</h3>
              <p className="text-xs text-muted-foreground">Live agent communication flow</p>
            </div>
            <div className="flex gap-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Active</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Idle</span>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 md:grid-cols-6">
            {agents.map((a) => {
              const Icon = iconMap[a.id];
              const live = a.status === "active";
              return (
                <div key={a.id} className="relative flex flex-col items-center text-center">
                  <div className="relative">
                    {live && <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-primary/30" />}
                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${live ? "bg-gradient-primary shadow-glow" : "bg-secondary"}`}>
                      <Icon className={`h-6 w-6 ${live ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] font-medium leading-tight">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">{a.confidence}% conf.</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card/60 p-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live data flow</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {["Intake", "Scribe", "Clinical", "Billing", "Follow-Up", "Analytics"].map((a, i, arr) => (
                <div key={a} className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">{a}</span>
                  {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Agent cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => {
          const Icon = iconMap[a.id];
          const live = a.status === "active";
          return (
            <Card key={a.id} className="group overflow-hidden p-5 transition hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${live ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{a.name}</p>
                    <Badge variant="outline" className={live ? "border-success/30 bg-success/10 text-success" : "border-border text-muted-foreground"}>
                      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-success" : "bg-muted-foreground"}`} />
                      {live ? "Active" : "Idle"}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  {live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="mt-4 rounded-lg bg-secondary/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current task</p>
                <p className="mt-0.5 text-sm">{a.task}</p>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{a.progress}%</span>
                </div>
                <Progress value={a.progress} className="h-1.5" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-success">{a.confidence}%</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Real-time activity feed</h3>
              <p className="text-xs text-muted-foreground">System orchestration timeline</p>
            </div>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3">
            {logs.map((l) => (
              <div key={l.time + l.agent + l.message} className="flex gap-3 rounded-lg border border-border/60 p-3 transition hover:bg-secondary/40">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px]">{l.agent}</Badge>
                    <span className="text-[10px] text-muted-foreground">{l.time}</span>
                  </div>
                  <p className="mt-0.5 text-sm">{l.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">AI task queue</h3>
          <div className="space-y-2">
            {queue.map((q) => (
              <div key={q.task} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium">{q.task}</p>
                  <Badge
                    variant="outline"
                    className={
                      q.priority === "high"
                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                        : q.priority === "medium"
                          ? "border-warning/30 bg-warning/15 text-warning"
                          : "border-border text-muted-foreground"
                    }
                  >
                    {q.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{q.agent} agent</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
