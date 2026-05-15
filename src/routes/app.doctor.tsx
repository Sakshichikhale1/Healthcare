import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, FileText, Pill, Sparkles, Volume2 } from "lucide-react";
import { ConsultationService, UploadService } from "@/services/api";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { recentPatients } from "@/lib/mock-data";

export const Route = createFileRoute("/app/doctor")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      patientId: search.patientId as string | undefined
    }
  },
  head: () => ({ meta: [{ title: "Doctor Workspace · ClinicOS AI" }] }),
  component: Doctor,
});

function Doctor() {
  const { patientId } = Route.useSearch();
  
  // Find patient from mock data or default to Liam
  const allPatients = [
    ...recentPatients,
    { id: "P-10278", name: "Emma Wallace", age: 38, condition: "Asthma", risk: "low", status: "Scheduled" },
    { id: "P-10277", name: "Noah Garcia", age: 56, condition: "Coronary Artery Disease", risk: "high", status: "Consulting" },
    { id: "P-10276", name: "Olivia Brown", age: 24, condition: "Anxiety", risk: "low", status: "Follow-up" },
    { id: "P-10275", name: "Ethan Wilson", age: 62, condition: "COPD", risk: "high", status: "Consulting" },
  ];

  const currentPatient = allPatients.find(p => p.id === patientId) || allPatients.find(p => p.id === "P-10279") || allPatients[0];

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<{ who: string; text: string }[]>([
    { who: "Dr. Mehta", text: `Good morning ${currentPatient.name.split(' ')[0]}, what brings you in today?` },
    { who: "Patient", text: `I've had this nagging ${currentPatient.condition.toLowerCase()} for about three weeks now.` },
  ]);
  const [soapNote, setSoapNote] = useState({
    subjective: `45M presents with 3-week history of ${currentPatient.condition.toLowerCase()}, non-radiating.`,
    objective: "Vitals stable. Examination findings consistent with diagnosis.",
    assessment: `${currentPatient.condition}. MRI/Labs show characteristic findings.`,
    plan: "Conservative management: NSAIDs, physical therapy, ergonomic counseling. Follow-up in 4 weeks.",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], "consultation.wav", { type: 'audio/wav' });
        handleAudioUpload(audioFile);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      toast.info("Recording started...");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast.info("Recording stopped, processing...");
    }
  };

  const handleAudioUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      // Use a dummy consultation ID for now
      const consultationId = 1;
      const response = await UploadService.uploadAudio(consultationId, file);
      toast.success("Audio uploaded, transcribing...");
      
      // Start polling for transcript
      pollTranscript(consultationId);
      
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload audio");
      setIsProcessing(false);
    }
  };

  const pollTranscript = async (consultationId: number) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
        setIsProcessing(false);
        return;
      }

      try {
        const res = await ConsultationService.getTranscript(consultationId);
        if (res.text && res.text.length > 0) {
          clearInterval(interval);
          setTranscript(prev => [...prev, { who: "AI Transcript", text: res.text }]);
          setIsProcessing(false);
          toast.success("Transcription complete");
          
          // Generate SOAP note
          generateSoapNote(consultationId);
        }
      } catch (e) {
        console.error("Error polling transcript:", e);
      }
    }, 2000);
  };

  const generateSoapNote = async (consultationId: number) => {
    toast.info("Generating SOAP note...");
    try {
      const res = await ConsultationService.getSoapNote(consultationId);
      if (res) {
        setSoapNote(res);
        toast.success("SOAP note updated");
      }
    } catch (e) {
      console.error("Error fetching SOAP note:", e);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes("Medical") || v.name.includes("Natural") || v.name.includes("Google US English")) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    toast.info("AI speaking...", { duration: 1000 });
  };

  const riskTone: Record<string, string> = {
    low: "border-success/30 bg-success/10 text-success",
    medium: "border-warning/30 bg-warning/15 text-warning",
    high: "border-destructive/30 bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Workspace" description="Consultation room with live AI scribing and clinical intelligence.">
        <Button variant="outline" size="sm" onClick={() => isRecording ? stopRecording() : startRecording()}>
          {isRecording ? <Pause className="mr-1.5 h-3.5 w-3.5" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
          {isRecording ? "Stop Recording" : "Record Consultation"}
        </Button>
        <Button size="sm" className="bg-gradient-primary">Sign & finish</Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Patient sidebar */}
        <Card className="h-fit p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-primary text-lg text-primary-foreground">
                {currentPatient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <p className="mt-3 text-sm font-semibold">{currentPatient.name}</p>
            <p className="text-xs text-muted-foreground">{currentPatient.id} · {currentPatient.age}y · {currentPatient.id === "P-10279" ? "Male" : "N/A"}</p>
            <Badge variant="outline" className={`mt-2 ${riskTone[currentPatient.risk]}`}>
              {currentPatient.risk.charAt(0).toUpperCase() + currentPatient.risk.slice(1)} risk
            </Badge>
          </div>
          <div className="mt-5 space-y-3 border-t border-border pt-4 text-xs">
            <div>
              <p className="text-muted-foreground">Vitals</p>
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                <div className="rounded-md bg-secondary p-2"><span className="text-muted-foreground">BP</span> <span className="font-semibold">132/84</span></div>
                <div className="rounded-md bg-secondary p-2"><span className="text-muted-foreground">HR</span> <span className="font-semibold">78</span></div>
                <div className="rounded-md bg-secondary p-2"><span className="text-muted-foreground">Temp</span> <span className="font-semibold">98.4</span></div>
                <div className="rounded-md bg-secondary p-2"><span className="text-muted-foreground">SpO₂</span> <span className="font-semibold">98%</span></div>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Allergies</p>
              <p className="mt-1 font-medium">Penicillin</p>
            </div>
            <div>
              <p className="text-muted-foreground">Active medications</p>
              <p className="mt-1 font-medium">Lisinopril 10mg</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {/* Audio player */}
          <Card className="flex items-center gap-4 p-4">
            <Button size="icon" className={`h-10 w-10 rounded-full bg-gradient-primary ${isRecording ? "animate-pulse" : ""}`} onClick={() => isRecording ? stopRecording() : startRecording()}>
              {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              {isRecording ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-6">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1 bg-primary animate-waveform" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }} />
                    ))}
                  </div>
                  <span className="text-xs text-primary font-medium animate-pulse">Recording live...</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>02:14</span><span>14:42</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-secondary">
                    <div className="h-full w-1/4 rounded-full bg-gradient-primary" />
                  </div>
                </>
              )}
            </div>
            <Badge className="border-success/30 bg-success/10 text-success">
              <Sparkles className="mr-1 h-3 w-3" /> Scribe live
            </Badge>
          </Card>

          <Tabs defaultValue="notes">
            <TabsList>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="recs">Recommendations</TabsTrigger>
              <TabsTrigger value="follow">Follow-Ups</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="grid gap-4 lg:grid-cols-2">
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Consultation transcript</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {transcript.map((t, i) => (
                    <div key={i} className="group relative rounded-lg bg-secondary/50 p-2.5 transition hover:bg-secondary/70">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">{t.who}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => speak(t.text)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm">{t.text}</p>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/30 p-2.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                      <span className="text-xs text-muted-foreground italic">Transcribing audio...</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">AI-generated SOAP note</h3>
                  <Badge variant="secondary" className="bg-success/10 text-success">94% conf.</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { l: "Subjective", t: soapNote.subjective },
                    { l: "Objective", t: soapNote.objective },
                    { l: "Assessment", t: soapNote.assessment },
                    { l: "Plan", t: soapNote.plan },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{s.l}</p>
                      <p className="mt-0.5 text-foreground/90">{s.t}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Visit history</h3>
                <div className="space-y-3">
                  {[
                    { d: "Mar 2026", t: "Annual physical", n: "Vitals stable, BP slightly elevated" },
                    { d: "Nov 2025", t: "Hypertension follow-up", n: "Started lisinopril 10mg" },
                    { d: "Aug 2025", t: "URI consultation", n: "Self-limited, supportive care" },
                  ].map((v) => (
                    <div key={v.d} className="flex gap-3 border-l-2 border-primary/40 pl-3">
                      <div>
                        <p className="text-xs font-semibold">{v.t}</p>
                        <p className="text-[10px] text-muted-foreground">{v.d}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{v.n}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Uploaded reports</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {["MRI Lumbar Spine", "CBC Panel", "Lipid Profile", "EKG Report"].map((r) => (
                    <div key={r} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{r}</p>
                        <p className="text-[10px] text-muted-foreground">Uploaded · 2026-05-12</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="recs">
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Medication recommendations</h3>
                <div className="space-y-2">
                  {[
                    { n: "Naproxen 500mg", d: "BID with food x 14 days", note: "Avoid PCN — none here" },
                    { n: "Cyclobenzaprine 5mg", d: "TID PRN spasm x 7 days", note: "Caution: drowsiness" },
                    { n: "Physical therapy referral", d: "2x/week x 6 weeks", note: "In-network: NovaPT" },
                  ].map((m) => (
                    <div key={m.n} className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <Pill className="mt-0.5 h-4 w-4 text-teal-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{m.n}</p>
                        <p className="text-xs text-muted-foreground">{m.d}</p>
                        <p className="mt-1 text-[10px] text-warning">{m.note}</p>
                      </div>
                      <Button size="sm" variant="outline">Prescribe</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="follow">
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold">Follow-Up plan</h3>
                <p className="text-sm text-muted-foreground">
                  Follow-Up Agent will schedule a 4-week recheck and send weekly adherence reminders via WhatsApp.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
