import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Pill, CalendarClock, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { followupAdherence } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/app/followup")({
  head: () => ({ meta: [{ title: "Follow-Up Automation · ClinicOS AI" }] }),
  component: Followup,
});

const flows = [
  { name: "Post-visit medication adherence", channel: "WhatsApp", patients: 482, completion: 92, status: "Live" },
  { name: "Post-op recovery check-ins", channel: "WhatsApp + SMS", patients: 64, completion: 88, status: "Live" },
  { name: "6-month preventive recall", channel: "Email", patients: 1284, completion: 71, status: "Live" },
  { name: "Chronic care coaching", channel: "WhatsApp", patients: 218, completion: 84, status: "Paused" },
];

const templates = [
  { id: 1, title: "Surgery Recovery", desc: "14-day daily check-in sequence via WhatsApp.", icon: Sparkles },
  { id: 2, title: "Diabetes Management", desc: "Weekly glucose check-in and medication reminders.", icon: Pill },
  { id: 3, title: "Pediatric Wellness", desc: "Vaccination schedule reminders and milestone tracking.", icon: CheckCircle2 },
  { id: 4, title: "Cardiology Follow-up", desc: "Post-stent medication adherence and symptom tracking.", icon: AlertTriangle },
];

const escalations = [
  { p: "Marcus Reed", r: "Missed 3 medication confirmations", t: "1h ago" },
  { p: "Priya Patel", r: "Reported chest discomfort in check-in", t: "3h ago" },
  { p: "Liam O'Brien", r: "Skipped PT session twice", t: "1d ago" },
];

function Followup() {
  const handleNewFlow = () => {
    toast.info("Automation Builder", {
      description: "Launching the multi-channel flow designer...",
    });
  };

  const handleApplyTemplate = (title: string) => {
    toast.success(`Template Applied: ${title}`, {
      description: "Review your new automation flow in the editor.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Follow-Up Automation" description="Patient engagement powered by the Follow-Up Agent.">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Templates</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Automation Templates</DialogTitle>
              <DialogDescription>
                Select a pre-built engagement workflow to jumpstart your automation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 md:grid-cols-2">
              {templates.map((t) => (
                <div key={t.id} className="group relative rounded-xl border border-border p-4 transition hover:border-primary/50 hover:bg-primary/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 group-hover:text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-semibold">{t.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                  <Button variant="ghost" size="sm" className="mt-3 w-full text-xs" onClick={() => handleApplyTemplate(t.title)}>
                    Use template
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button size="sm" className="bg-gradient-primary" onClick={handleNewFlow}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> New flow
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active flows" value="12" icon={<CalendarClock className="h-4 w-4" />} accent="primary" />
        <KpiCard label="Messages sent (7d)" value="18,420" change="+22%" icon={<MessageSquare className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Adherence rate" value="92%" change="+6%" icon={<Pill className="h-4 w-4" />} accent="success" />
        <KpiCard label="Escalations" value="14" change="-8%" trend="down" icon={<AlertTriangle className="h-4 w-4" />} accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Adherence trend</h3>
              <p className="text-xs text-muted-foreground">6-week rolling average</p>
            </div>
            <Badge className="bg-success/10 text-success">+20% vs baseline</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={followupAdherence}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="adherence" stroke="var(--color-success)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Live WhatsApp simulation</h3>
          <div className="rounded-xl border border-border bg-[#E5DDD5] h-[300px] flex flex-col overflow-hidden shadow-inner">
            <div className="bg-[#075E54] p-2 flex items-center gap-2 text-white shrink-0">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">Follow-Up Agent</p>
                <p className="text-[10px] opacity-80">Online</p>
              </div>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[80%]">
                Hi Liam! This is ClinicOS AI. How are you feeling after your consultation yesterday? Did you start the Naproxen?
                <span className="block text-[9px] text-muted-foreground text-right mt-1">10:42 AM</span>
              </div>
              <div className="bg-[#DCF8C6] p-2 rounded-lg rounded-tr-none shadow-sm text-[11px] max-w-[80%] self-end ml-auto">
                Hi, I'm feeling okay. A bit drowsy from the other pill though.
                <span className="block text-[9px] text-muted-foreground text-right mt-1">10:45 AM</span>
              </div>
              <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[11px] max-w-[80%]">
                That's likely the Cyclobenzaprine. It can cause drowsiness. Make sure to take it only before bed if possible. Shall I notify Dr. Mehta?
                <span className="block text-[9px] text-muted-foreground text-right mt-1">10:46 AM</span>
              </div>
            </div>
            <div className="p-2 bg-[#F0F0F0] flex gap-2 shrink-0">
              <div className="flex-1 bg-white rounded-full px-3 py-1 text-[11px] text-muted-foreground">Type a message...</div>
              <Button size="icon" className="h-7 w-7 rounded-full bg-[#128C7E]"><MessageSquare className="h-3 w-3" /></Button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Pending escalations</h4>
            {escalations.map((e) => (
              <div key={e.p} className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div>
                  <p className="text-xs font-semibold">{e.p}</p>
                  <p className="text-[10px] text-muted-foreground">{e.r}</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => toast.success(`Alert sent to doctor for ${e.p}`)}>Resolve</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Automation flows</h3>
        <div className="space-y-3">
          {flows.map((f) => (
            <div key={f.name} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.channel} · {f.patients} patients</p>
                </div>
                <Badge variant="outline" className={f.status === "Live" ? "border-success/30 bg-success/10 text-success" : "border-border text-muted-foreground"}>
                  {f.status}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={f.completion} className="h-1.5 flex-1" />
                <span className="text-xs font-medium">{f.completion}%</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                {["Trigger: visit complete", "Wait 24h", "Send WhatsApp", "Wait 7d", "Recheck", "Escalate if missed"].map((s, i, arr) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">{s}</span>
                    {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
