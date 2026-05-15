import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import {
  ArrowRight,
  Bot,
  Brain,
  Stethoscope,
  CreditCard,
  Bell,
  BarChart3,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Workflow,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClinicOS AI — Autonomous AI Operating System for Healthcare Clinics" },
      {
        name: "description",
        content:
          "ClinicOS AI orchestrates specialized agents for intake, scribing, billing, follow-ups, and analytics — purpose-built for modern clinics and hospitals.",
      },
      { property: "og:title", content: "ClinicOS AI — AI Operating System for Healthcare" },
      {
        property: "og:description",
        content: "Multi-agent AI for clinics. Automate intake, documentation, billing, and follow-ups.",
      },
    ],
  }),
  component: Landing,
});

const agents = [
  { icon: Bot, name: "Intake Agent", desc: "Onboards patients in seconds with structured extraction." },
  { icon: Stethoscope, name: "Scribe Agent", desc: "Real-time SOAP notes from consultations." },
  { icon: CreditCard, name: "Billing Agent", desc: "ICD-10 / CPT coding with claim risk scoring." },
  { icon: Bell, name: "Follow-Up Agent", desc: "WhatsApp & SMS engagement that drives adherence." },
  { icon: Brain, name: "Clinical Intelligence", desc: "Surface drug interactions and care gaps." },
  { icon: BarChart3, name: "Analytics Agent", desc: "Always-on KPIs for ops and revenue." },
];

const metrics = [
  { v: "9.4 hrs", l: "saved per doctor / week" },
  { v: "+27%", l: "revenue per visit" },
  { v: "92%", l: "follow-up adherence" },
  { v: "<30s", l: "patient intake" },
];

const tiers = [
  {
    name: "Starter",
    price: "$499",
    desc: "For small clinics getting started.",
    features: ["Up to 3 providers", "2 AI agents", "Patient intake + scribing", "Email support"],
  },
  {
    name: "Growth",
    price: "$1,499",
    desc: "For growing multi-provider clinics.",
    features: ["Up to 15 providers", "All 6 AI agents", "Billing & follow-up automation", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Hospitals and health networks.",
    features: ["Unlimited providers", "Dedicated agent tuning", "EHR + HL7/FHIR integration", "24/7 success team"],
  },
];

const testimonials = [
  {
    quote: "ClinicOS replaced four point tools. Our doctors leave on time again.",
    name: "Dr. Hannah Liu",
    role: "Medical Director, Riverside Health",
  },
  {
    quote: "The Billing Agent caught $42k in monthly leakage in week one.",
    name: "Marcus Patel",
    role: "CFO, Westbrook Medical Group",
  },
  {
    quote: "Patient adherence jumped from 64% to 91% after the WhatsApp flows.",
    name: "Dr. Amelia Reyes",
    role: "Lead Endocrinologist, NovaCare",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#agents" className="transition hover:text-foreground">Agents</a>
            <a href="#features" className="transition hover:text-foreground">Platform</a>
            <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="transition hover:text-foreground">Customers</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/dashboard">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-primary shadow-glow">
              <Link to="/app/dashboard">
                Open app <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 border border-border bg-background/80 px-3 py-1 backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              Multi-agent healthcare orchestration
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Autonomous AI Operating System
              <br />
              for <span className="text-gradient">Healthcare Clinics</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              ClinicOS deploys six specialized AI agents that intake patients, scribe consultations,
              code claims, automate follow-ups, and surface clinical insights — together, in real time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="bg-gradient-primary shadow-glow">
                <Link to="/app/dashboard">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/app/dashboard">Start Free Trial</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> HIPAA & SOC 2 Type II</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Setup in under a week</span>
              <span className="inline-flex items-center gap-1.5"><Workflow className="h-3.5 w-3.5 text-teal-foreground" /> Works with your EHR</span>
            </div>
          </div>

          {/* Hero workflow visual */}
          <div className="mx-auto mt-16 max-w-5xl">
            <Card className="overflow-hidden border-border/60 p-1 shadow-elegant">
              <div className="rounded-lg bg-gradient-to-br from-secondary/40 to-background p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { t: "Patient checks in", a: "Intake Agent extracts history & risk", c: "primary" },
                    { t: "Doctor consults", a: "Scribe writes SOAP notes in real time", c: "teal" },
                    { t: "Visit completes", a: "Billing + Follow-Up agents take over", c: "primary" },
                  ].map((s, i) => (
                    <div key={s.t} className="relative rounded-lg border border-border bg-card p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-semibold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium">{s.t}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{s.a}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-success">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background/60 p-3 text-xs">
                  <span className="font-medium">Orchestration health</span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>6 agents online</span>
                    <span>·</span>
                    <span>48,392 tasks today</span>
                    <span>·</span>
                    <span className="text-success">99.98% uptime</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-y border-border bg-secondary/30 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.l} className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-gradient md:text-4xl">{m.v}</p>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">Multi-agent AI</Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Six specialized agents. One operating system.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each agent owns a workflow. Together they form the autonomous backbone of your clinic.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <Card key={a.name} className="group border-border/60 p-6 transition-all hover:border-primary/40 hover:shadow-elegant">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary/10 text-primary ring-1 ring-primary/20">
                <a.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{a.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature blocks */}
      <section id="features" className="border-t border-border bg-secondary/20 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
          {[
            {
              t: "Time saved for doctors",
              d: "Scribe Agent listens to consultations and produces structured SOAP notes, ready to sign — saving 9+ hours per week.",
              icon: Stethoscope,
            },
            {
              t: "Revenue optimization",
              d: "Billing Agent codes claims with confidence scores, predicts denials, and flags revenue leakage before it happens.",
              icon: CreditCard,
            },
            {
              t: "Patient engagement automation",
              d: "Follow-Up Agent runs WhatsApp & SMS journeys for medication adherence, post-op recovery, and re-bookings.",
              icon: Bell,
            },
            {
              t: "Workflow orchestration",
              d: "Agents pass context to each other through a shared clinical graph — no copy-paste, no lost data.",
              icon: Workflow,
            },
          ].map((f) => (
            <div key={f.t} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{f.t}</h3>
                <p className="mt-2 text-muted-foreground">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Trusted by modern clinics</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/60 p-6">
              <div className="mb-3 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Pricing built for clinics</h2>
            <p className="mt-3 text-muted-foreground">Start free. Upgrade when your clinic scales.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <Card
                key={t.name}
                className={`relative p-6 ${t.featured ? "border-primary/40 shadow-elegant ring-1 ring-primary/20" : "border-border/60"}`}
              >
                {t.featured && (
                  <Badge className="absolute -top-2 right-4 bg-gradient-primary text-primary-foreground">
                    Most popular
                  </Badge>
                )}
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
                  {t.price !== "Custom" && <span className="text-sm text-muted-foreground">/mo</span>}
                </div>
                <Button
                  className={`mt-5 w-full ${t.featured ? "bg-gradient-primary" : ""}`}
                  variant={t.featured ? "default" : "outline"}
                  asChild
                >
                  <Link to="/app/dashboard">Get started</Link>
                </Button>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Card className="relative overflow-hidden border-border/60 p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Run your clinic on autopilot.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              See ClinicOS AI in action with your own data. Onboard in under a week.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="bg-gradient-primary shadow-glow">
                <Link to="/app/dashboard">Request Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/app/dashboard">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The AI operating system for modern healthcare clinics and hospitals.
            </p>
          </div>
          {[
            { title: "Product", items: ["Agents", "Pricing", "Integrations", "Security"] },
            { title: "Company", items: ["About", "Customers", "Careers", "Contact"] },
            { title: "Resources", items: ["Docs", "Changelog", "Status", "Press"] },
          ].map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold">{c.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {c.items.map((i) => (
                  <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border px-6 pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 ClinicOS AI · HIPAA · SOC 2 · GDPR</p>
          <p>Built for the future of medicine.</p>
        </div>
      </footer>
    </div>
  );
}
