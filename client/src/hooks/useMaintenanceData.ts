import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import type { Machine } from "@shared/schema";
import { MachineStatus } from "@shared/schema";

export function useMaintenanceData() {
  const { data: machines = [], isLoading } = useQuery<Machine[]>({
    queryKey: QUERY_KEYS.machines,
  });

  const healthyCount = machines.filter(m => m.status === MachineStatus.OK).length;
  const dueSoonCount = machines.filter(m => m.status === MachineStatus.DUE_SOON).length;
  const overdueCount = machines.filter(m => m.status === MachineStatus.OVERDUE).length;

  return {
    machines,
    isLoading,
    healthyCount,
    dueSoonCount,
    overdueCount,
    totalCount: machines.length,
  };
}
