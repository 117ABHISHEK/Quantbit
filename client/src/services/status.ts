import { MachineStatus, type MachineStatusType } from "@shared/schema";
import { differenceInDays, parseISO, addDays, formatISO } from "date-fns";

export function calculateMachineStatus(nextMaintenance: string | null): MachineStatusType {
  if (!nextMaintenance) return MachineStatus.OK;
  
  const today = new Date();
  const nextDate = parseISO(nextMaintenance);
  const daysUntilMaintenance = differenceInDays(nextDate, today);
  
  if (daysUntilMaintenance < 0) {
    return MachineStatus.OVERDUE;
  } else if (daysUntilMaintenance <= 3) {
    return MachineStatus.DUE_SOON;
  } else {
    return MachineStatus.OK;
  }
}

export function calculateNextMaintenance(lastMaintenanceDate: string, intervalDays: number = 30): string {
  const lastDate = parseISO(lastMaintenanceDate);
  const nextDate = addDays(lastDate, intervalDays);
  return formatISO(nextDate, { representation: 'date' });
}

export function getDaysUntilMaintenance(nextMaintenance: string | null): number | null {
  if (!nextMaintenance) return null;
  const today = new Date();
  const nextDate = parseISO(nextMaintenance);
  return differenceInDays(nextDate, today);
}
