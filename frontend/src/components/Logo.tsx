import { Activity } from "lucide-react";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
        <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-foreground">ClinicOS</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
