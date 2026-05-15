import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings · ClinicOS AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your clinic, agents, and team." />

      <Tabs defaultValue="clinic">
        <TabsList>
          <TabsTrigger value="clinic">Clinic</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="notifs">Notifications</TabsTrigger>
          <TabsTrigger value="integ">Integrations</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="clinic">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Clinic profile</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Clinic name</Label><Input defaultValue="NovaCare Medical Group" /></div>
              <div className="space-y-1.5"><Label>NPI</Label><Input defaultValue="1234567890" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Input defaultValue="245 Madison Ave, Suite 800, New York, NY" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+1 (212) 555-0184" /></div>
              <div className="space-y-1.5"><Label>Time zone</Label><Input defaultValue="America/New_York" /></div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm" className="bg-gradient-primary">Save changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Agent configuration</h3>
            <div className="space-y-3">
              {["Intake Agent", "Scribe Agent", "Billing Agent", "Follow-Up Agent", "Clinical Intelligence", "Analytics Agent"].map((a, i) => (
                <div key={a} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-semibold">{a}</p>
                    <p className="text-xs text-muted-foreground">Auto-confidence threshold · {88 + i}%</p>
                  </div>
                  <Switch defaultChecked={i !== 3} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifs">
          <Card className="p-6 space-y-3">
            {["High-risk claim flagged", "Clinical alerts", "Daily KPI digest", "New patient intake", "Failed follow-ups"].map((n, i) => (
              <div key={n} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{n}</p>
                  <p className="text-xs text-muted-foreground">Email · Slack · Mobile push</p>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="integ">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "Epic EHR", s: "Connected" },
              { n: "Cerner", s: "Connect" },
              { n: "Stripe", s: "Connected" },
              { n: "Twilio WhatsApp", s: "Connected" },
              { n: "Google Calendar", s: "Connect" },
              { n: "Zoom Telehealth", s: "Connected" },
            ].map((i) => (
              <Card key={i.n} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{i.n}</p>
                  <Badge variant={i.s === "Connected" ? "secondary" : "outline"} className={i.s === "Connected" ? "bg-success/10 text-success" : ""}>
                    {i.s}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full">Manage</Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <div className="space-y-2">
              {[
                { n: "Dr. Mehta", r: "Admin", e: "mehta@novacare.com" },
                { n: "Dr. Lee", r: "Physician", e: "lee@novacare.com" },
                { n: "Dr. Adler", r: "Physician", e: "adler@novacare.com" },
                { n: "Sara Kim", r: "Billing", e: "sara@novacare.com" },
              ].map((u) => (
                <div key={u.e} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="bg-gradient-primary text-xs text-primary-foreground">{u.n.split(" ").map((s) => s[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{u.n}</p>
                    <p className="text-xs text-muted-foreground">{u.e}</p>
                  </div>
                  <Badge variant="outline">{u.r}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div><p className="text-sm font-semibold">Two-factor authentication</p><p className="text-xs text-muted-foreground">Required for all admin users</p></div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div><p className="text-sm font-semibold">Audit log retention</p><p className="text-xs text-muted-foreground">90 days · HIPAA compliant</p></div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold">Session timeout</p><p className="text-xs text-muted-foreground">15 minutes of inactivity</p></div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
