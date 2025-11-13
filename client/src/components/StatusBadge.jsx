import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
const iconMap = {
    CheckCircle2,
    Clock,
    AlertCircle,
};
export function StatusBadge({ status, size = "default" }) {
    const config = STATUS_CONFIG[status];
    const Icon = iconMap[config.icon];
    return (<Badge variant="outline" className={`${config.color} font-semibold uppercase tracking-wide border ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`} data-testid={`badge-status-${status.toLowerCase().replace(' ', '-')}`}>
      <Icon className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-1.5`}/>
      {config.label}
    </Badge>);
}
