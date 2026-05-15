import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UserPlus,
  Bot,
  Stethoscope,
  CreditCard,
  Bell,
  BarChart3,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Patient Intake", url: "/app/intake", icon: UserPlus },
  { title: "AI Agent Console", url: "/app/agents", icon: Bot, badge: "Live" },
  { title: "Doctor Workspace", url: "/app/doctor", icon: Stethoscope },
];

const opsItems = [
  { title: "Billing & Insurance", url: "/app/billing", icon: CreditCard },
  { title: "Follow-Up Automation", url: "/app/followup", icon: Bell },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
];

const recordItems = [
  { title: "Patients", url: "/app/patients", icon: Users },
  { title: "Reports", url: "/app/reports", icon: FileText },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const renderItems = (items: typeof mainItems) => (
    <SidebarMenu>
      {items.map((item) => {
        const active = pathname.startsWith(item.url);
        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
              <Link to={item.url} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {"badge" in item && item.badge && (
                      <Badge
                        variant="secondary"
                        className="h-5 border-0 bg-teal/15 px-1.5 text-[10px] font-semibold text-teal-foreground"
                      >
                        <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <Logo collapsed={collapsed} />
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(mainItems)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(opsItems)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(recordItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="rounded-lg bg-gradient-primary p-3 text-primary-foreground">
            <p className="text-xs font-semibold">Enterprise Plan</p>
            <p className="mt-0.5 text-[11px] opacity-80">3 AI agents available to upgrade</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
