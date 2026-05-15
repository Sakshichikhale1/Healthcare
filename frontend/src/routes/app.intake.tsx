import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PatientService } from "@/services/api";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Mic, FileText, Check, Sparkles, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/app/intake")({
  head: () => ({ meta: [{ title: "Patient Intake · ClinicOS AI" }] }),
  component: Intake,
});

const timeline = [
  { label: "Reports uploaded", done: true },
  { label: "Symptoms captured", done: true },
  { label: "Medical history", done: true },
  { label: "Insurance verified", done: false },
  { label: "Appointment booked", done: false },
];

import { UploadService } from "@/services/api";
import { toast } from "sonner";
import { useRef } from "react";

function Intake() {
  const [formData, setFormData] = useState({
    firstName: "Liam",
    lastName: "O'Brien",
    chiefComplaint: "Lower back pain, intermittent",
    duration: "3 weeks",
    description: "Aching pain in the lumbar region, worse after prolonged sitting. No radiation to legs.",
    allergies: "Penicillin",
    medications: "Lisinopril 10mg",
    insurance: "BlueCross PPO",
    policy: "BX-4421-78329",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, progress: number, id?: number, data?: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => file.type === "application/pdf" || file.type.startsWith("image/"));
    
    if (newFiles.length === 0) {
      toast.error("Please upload PDF or Image files only.");
      return;
    }

    for (const file of newFiles) {
      const fileId = Math.random();
      setUploadedFiles(prev => [...prev, { 
        name: file.name, 
        size: (file.size / 1024 / 1024).toFixed(1) + " MB", 
        progress: 10 
      }]);

      try {
        // Use a dummy patient ID for now or get it from context
        const response = await UploadService.uploadReport(1, file);
        toast.success(`Uploaded ${file.name} successfully`);
        
        const reportId = response.report_id;
        
        // Start polling for extraction status
        pollReportStatus(reportId, file.name);
        
      } catch (e) {
        console.error(e);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const pollReportStatus = async (reportId: number, fileName: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
        return;
      }

      try {
        const report = await UploadService.getReportStatus(reportId);
        if (report.extracted_data) {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.name === fileName ? { ...f, progress: 100, data: report.extracted_data } : f
          ));
          toast.success(`Data extracted from ${fileName}`);
          
          // If we have summary data, update the AI patient summary
          if (report.extracted_data.summary) {
            // This is a bit complex since the summary in the UI is hardcoded.
            // For now, let's just log it and maybe update a state.
            console.log("Extracted Data:", report.extracted_data.summary);
          }
        } else {
          setUploadedFiles(prev => prev.map(f => 
            f.name === fileName ? { ...f, progress: Math.min(90, f.progress + 10) } : f
          ));
        }
      } catch (e) {
        console.error("Error polling report status:", e);
      }
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await PatientService.createPatient({
        first_name: formData.firstName,
        last_name: formData.lastName,
        medical_history: {
          chief_complaint: formData.chiefComplaint,
          duration: formData.duration,
          description: formData.description,
          allergies: formData.allergies,
          medications: formData.medications,
          insurance: formData.insurance,
          policy: formData.policy
        }
      });
      toast.success("Intake submitted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Error submitting intake");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Intake" description="Onboard a new patient with AI-assisted extraction.">
        <Button variant="outline" size="sm">Save draft</Button>
        <Button size="sm" className="bg-gradient-primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit intake"}
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <h3 className="mb-1 text-sm font-semibold">Upload medical reports</h3>
            <p className="mb-4 text-xs text-muted-foreground">Lab work, imaging, prescriptions — PDF, JPG, DOCX.</p>
            <div 
              className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-10 text-center transition hover:border-primary/40 hover:bg-secondary/50 cursor-pointer"
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                multiple 
                accept=".pdf,image/*" 
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <UploadCloud className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 text-sm font-medium">Drop files here or click to upload</p>
              <p className="mt-1 text-xs text-muted-foreground">Max 50MB · PDF, JPG, PNG, DOCX</p>
              <Button size="sm" className="mt-4 bg-gradient-primary">Choose files</Button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="flex-1 truncate text-xs font-medium">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground">{f.size}</span>
                  </div>
                  <Progress value={f.progress} className="mt-2 h-1" />
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {f.progress === 100 ? "Extracted by Intake Agent" : `Extracting · ${f.progress}%`}
                  </p>
                  {f.data && f.data.summary && (
                    <div className="mt-2 rounded bg-secondary/50 p-2 text-[10px]">
                      <p className="font-semibold">Summary:</p>
                      <p className="line-clamp-2">{f.data.summary.summary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/20 py-3 text-xs text-muted-foreground transition hover:bg-secondary/50">
              <Mic className="h-3.5 w-3.5" /> Upload voice consultation
            </button>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Symptoms & history</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Chief complaint</Label>
                <Input value={formData.chiefComplaint} onChange={e => setFormData({...formData, chiefComplaint: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Symptom description</Label>
                <Textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Allergies</Label>
                <Input value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Current medications</Label>
                <Input value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})} />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Insurance & appointment</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Insurance provider</Label>
                <Input value={formData.insurance} onChange={e => setFormData({...formData, insurance: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Policy #</Label>
                <Input value={formData.policy} onChange={e => setFormData({...formData, policy: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label>Preferred date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Preferred doctor</Label>
                <Input defaultValue="Dr. Mehta — Cardiology" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="overflow-hidden p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI patient summary</h3>
              <Badge variant="secondary" className="ml-auto bg-success/10 text-success">96% confidence</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Patient</p>
                <p className="font-medium">Liam O'Brien · 45y · M</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Summary</p>
                <p className="text-foreground/90">
                  Lower back pain x 3 weeks. History of hypertension, controlled on lisinopril.
                  MRI shows mild L4-L5 disc bulge. No red flags. PCN allergy noted.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Risk</p>
                  <p className="text-sm font-semibold text-warning">Medium</p>
                </div>
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-[10px] uppercase text-muted-foreground">Triage</p>
                  <p className="text-sm font-semibold">Routine</p>
                </div>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 text-warning" />
                  <p>PCN allergy detected — alternative antibiotics recommended.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Intake timeline</h3>
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={t.label} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${t.done ? "bg-success/15 text-success" : "border border-border bg-secondary text-muted-foreground"}`}>
                    {t.done ? <Check className="h-3 w-3" /> : <span className="text-[10px]">{i + 1}</span>}
                  </div>
                  <span className={`text-sm ${t.done ? "text-foreground" : "text-muted-foreground"}`}>{t.label}</span>
                </div>
              ))}
            </div>
            <Progress value={60} className="mt-4 h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">3 of 5 steps complete</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
