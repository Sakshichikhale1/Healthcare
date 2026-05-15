export const kpis = [
  { label: "Total Patients", value: "12,847", change: "+12.4%", trend: "up" as const },
  { label: "Active Consultations", value: "284", change: "+8.2%", trend: "up" as const },
  { label: "AI Tasks Completed", value: "48,392", change: "+24.1%", trend: "up" as const },
  { label: "Monthly Revenue", value: "$1.42M", change: "+18.7%", trend: "up" as const },
];

export const appointmentTrend = [
  { day: "Mon", appointments: 142, ai: 98 },
  { day: "Tue", appointments: 168, ai: 124 },
  { day: "Wed", appointments: 189, ai: 156 },
  { day: "Thu", appointments: 175, ai: 138 },
  { day: "Fri", appointments: 210, ai: 182 },
  { day: "Sat", appointments: 156, ai: 121 },
  { day: "Sun", appointments: 98, ai: 76 },
];

export const revenueData = [
  { month: "Jan", revenue: 820000, claims: 640000 },
  { month: "Feb", revenue: 932000, claims: 720000 },
  { month: "Mar", revenue: 901000, claims: 712000 },
  { month: "Apr", revenue: 1043000, claims: 856000 },
  { month: "May", revenue: 1180000, claims: 980000 },
  { month: "Jun", revenue: 1290000, claims: 1080000 },
  { month: "Jul", revenue: 1420000, claims: 1210000 },
];

export const claimRisk = [
  { name: "Low Risk", value: 612, color: "var(--color-success)" },
  { name: "Medium Risk", value: 184, color: "var(--color-warning)" },
  { name: "High Risk", value: 47, color: "var(--color-destructive)" },
];

export const followupAdherence = [
  { week: "W1", adherence: 72 },
  { week: "W2", adherence: 78 },
  { week: "W3", adherence: 81 },
  { week: "W4", adherence: 86 },
  { week: "W5", adherence: 89 },
  { week: "W6", adherence: 92 },
];

export const recentPatients = [
  { id: "P-10284", name: "Aisha Khan", age: 34, condition: "Hypertension", risk: "medium", status: "Consulting" },
  { id: "P-10283", name: "Marcus Reed", age: 52, condition: "Type 2 Diabetes", risk: "high", status: "Follow-up" },
  { id: "P-10282", name: "Sofia Martinez", age: 28, condition: "Annual Checkup", risk: "low", status: "Completed" },
  { id: "P-10281", name: "James Chen", age: 41, condition: "Migraine", risk: "low", status: "Intake" },
  { id: "P-10280", name: "Priya Patel", age: 67, condition: "Arrhythmia", risk: "high", status: "Consulting" },
  { id: "P-10279", name: "Liam O'Brien", age: 45, condition: "Lower Back Pain", risk: "medium", status: "Scheduled" },
];

export const agents = [
  { id: "intake", name: "Intake Agent", status: "active", task: "Processing patient P-10284 medical history", confidence: 96, progress: 72, color: "primary" },
  { id: "scribe", name: "Scribe Agent", status: "active", task: "Transcribing consultation #4892", confidence: 94, progress: 48, color: "teal" },
  { id: "billing", name: "Billing Agent", status: "active", task: "Coding 12 claims with ICD-10", confidence: 91, progress: 86, color: "primary" },
  { id: "followup", name: "Follow-Up Agent", status: "idle", task: "Scheduled 184 reminders for tomorrow", confidence: 98, progress: 100, color: "teal" },
  { id: "clinical", name: "Clinical Intelligence", status: "active", task: "Analyzing lab results for P-10280", confidence: 89, progress: 34, color: "primary" },
  { id: "analytics", name: "Analytics Agent", status: "active", task: "Generating weekly KPI report", confidence: 99, progress: 64, color: "teal" },
];

export const agentLog = [
  { time: "12:42:18", agent: "Scribe", message: "Generated SOAP notes for visit #4892" },
  { time: "12:41:55", agent: "Intake", message: "Extracted 14 fields from uploaded MRI report" },
  { time: "12:41:32", agent: "Billing", message: "Suggested CPT 99214 with 94% confidence" },
  { time: "12:40:48", agent: "Clinical", message: "Flagged potential drug interaction: Warfarin + NSAID" },
  { time: "12:40:11", agent: "Follow-Up", message: "Sent WhatsApp reminder to 47 patients" },
  { time: "12:39:42", agent: "Analytics", message: "Detected revenue leakage in Cardiology dept ($12.4k)" },
  { time: "12:39:08", agent: "Intake", message: "Completed onboarding for patient P-10284" },
];

export const claims = [
  { id: "CL-88421", patient: "Aisha Khan", payer: "BlueCross", amount: "$1,840", risk: "low", status: "Submitted" },
  { id: "CL-88420", patient: "Marcus Reed", payer: "Aetna", amount: "$3,210", risk: "high", status: "Pending" },
  { id: "CL-88419", patient: "Sofia Martinez", payer: "United", amount: "$420", risk: "low", status: "Paid" },
  { id: "CL-88418", patient: "Priya Patel", payer: "Medicare", amount: "$5,640", risk: "medium", status: "Review" },
  { id: "CL-88417", patient: "James Chen", payer: "Cigna", amount: "$890", risk: "low", status: "Paid" },
  { id: "CL-88416", patient: "Liam O'Brien", payer: "Humana", amount: "$2,180", risk: "high", status: "Denied" },
];

export const upcomingAppointments = [
  { time: "2:00 PM", patient: "Aisha Khan", doctor: "Dr. Mehta", type: "Cardiology" },
  { time: "2:30 PM", patient: "Marcus Reed", doctor: "Dr. Lee", type: "Endocrinology" },
  { time: "3:15 PM", patient: "Sofia Martinez", doctor: "Dr. Mehta", type: "General" },
  { time: "4:00 PM", patient: "Priya Patel", doctor: "Dr. Adler", type: "Cardiology" },
];
