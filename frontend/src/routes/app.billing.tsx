import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, AlertTriangle, FileCheck, TrendingUp, Sparkles } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { claims, revenueData } from "@/lib/mock-data";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing & Insurance · ClinicOS AI" }] }),
  component: Billing,
});

const riskTone: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/15 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusTone: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Submitted: "bg-primary/10 text-primary",
  Pending: "bg-warning/15 text-warning",
  Review: "bg-accent text-accent-foreground",
  Denied: "bg-destructive/10 text-destructive",
};

import { jsPDF } from "jspdf";
import { toast } from "sonner";

function Billing() {
  const handleGenerateInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("ClinicOS AI - Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text("Patient: Liam O'Brien", 20, 40);
    doc.text("Provider: Dr. Mehta", 20, 50);
    
    doc.line(20, 55, 190, 55);
    
    doc.text("Description", 20, 65);
    doc.text("Code", 100, 65);
    doc.text("Amount", 160, 65);
    
    doc.text("Consultation Level 4", 20, 75);
    doc.text("CPT 99214", 100, 75);
    doc.text("$150.00", 160, 75);
    
    doc.text("MRI Lumbar", 20, 85);
    doc.text("CPT 72148", 100, 85);
    doc.text("$450.00", 160, 85);
    
    doc.line(20, 95, 190, 95);
    doc.setFontSize(14);
    doc.text("Total: $600.00", 145, 105);
    
    doc.save("invoice-liam-obrien.pdf");
    toast.success("Invoice generated and downloaded");
  };

  const handleExportCSV = () => {
    const headers = ["Claim ID", "Patient", "Payer", "Amount", "Risk", "Status"];
    const rows = claims.map(c => [c.id, c.patient, c.payer, c.amount, c.risk, c.status]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "claims_export.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Claims data exported to CSV");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Insurance" description="Healthcare revenue management with AI claim coding.">
        <Button variant="outline" size="sm" onClick={handleExportCSV}>Export</Button>
        <Button size="sm" className="bg-gradient-primary" onClick={handleGenerateInvoice}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Generate invoice
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Monthly revenue" value="$1.42M" change="+18.7%" icon={<DollarSign className="h-4 w-4" />} accent="success" />
        <KpiCard label="Claims at risk" value="47" change="-12%" trend="down" icon={<AlertTriangle className="h-4 w-4" />} accent="warning" />
        <KpiCard label="Approval rate" value="94.2%" change="+2.1%" icon={<FileCheck className="h-4 w-4" />} accent="primary" />
        <KpiCard label="Leakage prevented" value="$48.2k" change="+24%" icon={<TrendingUp className="h-4 w-4" />} accent="teal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Revenue & collections</h3>
              <p className="text-xs text-muted-foreground">Last 7 months</p>
            </div>
            <Badge className="bg-success/10 text-success">+18.7%</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="claims" stroke="var(--color-teal)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">AI coding suggestions</h3>
          </div>
          <div className="space-y-3">
            {[
              { code: "ICD-10: M54.5", d: "Lower back pain", c: 96 },
              { code: "CPT 99214", d: "Office visit, established", c: 94 },
              { code: "CPT 72148", d: "MRI lumbar without contrast", c: 91 },
              { code: "ICD-10: M51.36", d: "Disc displacement L4-L5", c: 88 },
            ].map((s) => (
              <div key={s.code} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">{s.code}</p>
                  <Badge variant="secondary" className="bg-success/10 text-success">{s.c}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.d}</p>
                <Progress value={s.c} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Insurance claims</h3>
            <p className="text-xs text-muted-foreground">Live risk scoring</p>
          </div>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
                <TableCell className="font-medium">{c.patient}</TableCell>
                <TableCell>{c.payer}</TableCell>
                <TableCell className="font-semibold">{c.amount}</TableCell>
                <TableCell><Badge variant="outline" className={riskTone[c.risk]}>{c.risk}</Badge></TableCell>
                <TableCell><Badge variant="secondary" className={statusTone[c.status]}>{c.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
