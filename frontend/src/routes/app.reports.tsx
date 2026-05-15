import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Sparkles, Download, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports · ClinicOS AI" }] }),
  component: Reports,
});

const reportData: Record<string, { summary: string; findings: { title: string; desc: string; type: "critical" | "warning" | "normal" }[] }> = {
  "MRI Lumbar Spine — L. O'Brien": {
    summary: "Evaluation of the lumbar spine reveals degenerative changes at the L4-L5 level with associated disc protrusion.",
    findings: [
      { title: "Disc Protrusion", desc: "3mm posterior-central protrusion at L4-L5.", type: "warning" },
      { title: "Neural Foramina", desc: "Mild bilateral foraminal narrowing at L5-S1.", type: "normal" },
      { title: "Vertebral Alignment", desc: "Normal lumbar lordosis and vertebral body heights.", type: "normal" },
      { title: "Spinal Canal", desc: "No evidence of spinal stenosis or cauda equina compression.", type: "normal" },
    ]
  },
  "CBC Panel — Aisha Khan": {
    summary: "Routine complete blood count shows normal white cell distribution with slightly elevated hemoglobin.",
    findings: [
      { title: "Hemoglobin", desc: "15.8 g/dL (High-normal range).", type: "normal" },
      { title: "WBC Count", desc: "6.4 x10^9/L (Within normal range).", type: "normal" },
    ]
  },
  "Echocardiogram — Priya Patel": {
    summary: "Transthoracic echocardiogram demonstrates preserved ejection fraction with mild mitral regurgitation.",
    findings: [
      { title: "Ejection Fraction", desc: "LVEF estimated at 62% (Normal).", type: "normal" },
      { title: "Valvular Function", desc: "Trace to mild mitral regurgitation noted.", type: "warning" },
      { title: "Chamber Size", desc: "Normal left ventricular internal dimensions.", type: "normal" },
      { title: "Wall Motion", desc: "No regional wall motion abnormalities identified.", type: "normal" },
      { title: "Pericardium", desc: "No pericardial effusion seen.", type: "normal" },
      { title: "Aortic Root", desc: "Normal aortic root diameter (3.2cm).", type: "normal" },
    ]
  },
  "Lipid Profile — Marcus Reed": {
    summary: "Lipid panel indicates borderline elevated LDL-C with normal HDL-C and triglycerides.",
    findings: [
      { title: "LDL Cholesterol", desc: "134 mg/dL (Borderline high).", type: "warning" },
      { title: "HDL Cholesterol", desc: "48 mg/dL (Normal).", type: "normal" },
      { title: "Triglycerides", desc: "142 mg/dL (Normal).", type: "normal" },
    ]
  },
  "EKG — Noah Garcia": {
    summary: "12-lead EKG shows normal sinus rhythm with non-specific ST-T wave changes.",
    findings: [
      { title: "Rhythm", desc: "Normal sinus rhythm, heart rate 72 bpm.", type: "normal" },
      { title: "Intervals", desc: "PR, QRS, and QTc intervals within normal limits.", type: "normal" },
      { title: "Ischemia", desc: "Non-specific ST-segment flattening in lateral leads.", type: "warning" },
      { title: "Axis", desc: "Normal QRS axis (45 degrees).", type: "normal" },
      { title: "Hypertrophy", desc: "No evidence of ventricular hypertrophy.", type: "normal" },
    ]
  }
};

const reports = [
  { id: 1, name: "MRI Lumbar Spine — L. O'Brien", date: "May 12, 2026", type: "Imaging", findingsCount: 4 },
  { id: 2, name: "CBC Panel — Aisha Khan", date: "May 11, 2026", type: "Lab", findingsCount: 2 },
  { id: 3, name: "Echocardiogram — Priya Patel", date: "May 10, 2026", type: "Cardiology", findingsCount: 6 },
  { id: 4, name: "Lipid Profile — Marcus Reed", date: "May 9, 2026", type: "Lab", findingsCount: 3 },
  { id: 5, name: "EKG — Noah Garcia", date: "May 8, 2026", type: "Cardiology", findingsCount: 5 },
];

function Reports() {
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReports = reports.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading(`Uploading ${file.name}...`, { id: "upload-toast" });

    // Simulate upload and AI analysis
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`${file.name} uploaded and analyzed.`, {
        id: "upload-toast",
        description: "Clinical Agent has extracted 4 new findings.",
      });
      // Optionally add to the list in a real app
    }, 2000);
  };

  const detail = reportData[selectedReport.name] || reportData["MRI Lumbar Spine — L. O'Brien"];

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      <PageHeader title="Medical Reports" description="AI-summarized reports and findings library.">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        <Button size="sm" className="bg-gradient-primary" onClick={() => toast.success("Batch analysis complete. 5 reports synchronized.")}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Summarize all
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="flex flex-col h-[calc(100vh-220px)] p-4">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search reports…" 
              className="h-9 pl-9 text-xs" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
            {filteredReports.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`w-full rounded-xl border p-3 text-left transition duration-200 ${selectedReport.id === r.id ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border hover:bg-secondary/50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selectedReport.id === r.id ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[11px] font-semibold">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.date} · {r.type}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] h-4.5 px-1.5 bg-background/50">{r.findingsCount} findings</Badge>
                      {selectedReport.id === r.id && <div className="h-1 w-1 rounded-full bg-primary" />}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-220px)] pr-1 custom-scrollbar">
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{selectedReport.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedReport.date} · {selectedReport.type} Report</p>
              </div>
              <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success(`Preparing ${selectedReport.name} for download...`)}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-[4/3] rounded-xl border border-border bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-teal-500/5 opacity-50" />
                <div className="relative text-center z-10">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-elegant">
                    <FileText className="h-8 w-8 text-primary/60" />
                  </div>
                  <p className="text-xs font-medium">Digital Preview</p>
                  <p className="mt-1 text-[10px] text-muted-foreground italic">Authenticated via HealthOS Network</p>
                  <Badge variant="outline" className="mt-4 border-success/30 bg-success/5 text-success animate-pulse">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> AI Digitized
                  </Badge>
                </div>
                {/* Visual fluff for "MRI" or "Lab" */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-1 h-8 items-end">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="flex-1 bg-primary/10 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                   ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Clinical Intelligence Summary</h4>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                  "{detail.summary}"
                </p>
                
                <div className="space-y-4 pt-2">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="rounded-xl border border-border bg-secondary/20 p-3">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">Processing Time</p>
                        <p className="text-sm font-bold">1.2s</p>
                     </div>
                     <div className="rounded-xl border border-border bg-secondary/20 p-3">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">AI Confidence</p>
                        <p className="text-sm font-bold text-success">98.4%</p>
                     </div>
                   </div>
                   <Button className="w-full bg-gradient-primary h-10 group" variant="default">
                     Discuss with Clinical Agent
                     <Sparkles className="ml-2 h-4 w-4 group-hover:animate-spin" />
                   </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Extracted Findings ({detail.findings.length})</h3>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">Automatic Extraction</Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {detail.findings.map((f, i) => (
                <div key={i} className="group relative rounded-xl border border-border p-4 transition duration-200 hover:border-primary/30 hover:bg-primary/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{f.title}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-[9px] uppercase tracking-tighter ${
                      f.type === "warning" ? "border-warning/30 bg-warning/10 text-warning" : 
                      f.type === "critical" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                      "border-success/30 bg-success/10 text-success"
                    }`}>
                      {f.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
