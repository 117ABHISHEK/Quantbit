import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Machine status enum for type safety
export const MachineStatus = {
  OK: "OK",
  DUE_SOON: "Due Soon",
  OVERDUE: "Overdue",
} as const;

export type MachineStatusType = typeof MachineStatus[keyof typeof MachineStatus];

// Zod enum for validation
const machineStatusEnum = z.enum([MachineStatus.OK, MachineStatus.DUE_SOON, MachineStatus.OVERDUE]);

// Machine schema
// Dates stored as ISO-8601 strings for compatibility with in-memory storage
export const machines = pgTable("machines", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  lastMaintenance: text("last_maintenance"), // ISO-8601 date string
  nextMaintenance: text("next_maintenance"), // ISO-8601 date string
  status: text("status").notNull(), // "OK", "Due Soon", "Overdue"
  maintenanceIntervalDays: integer("maintenance_interval_days").notNull().default(30),
});

export const insertMachineSchema = createInsertSchema(machines).omit({
  id: true,
  status: true,
  nextMaintenance: true,
}).extend({
  name: z.string().min(1, "Machine name is required"),
  type: z.string().min(1, "Machine type is required"),
  lastMaintenance: z.string().optional(),
  maintenanceIntervalDays: z.coerce.number().int().min(1).default(30),
});

export const updateMachineSchema = createInsertSchema(machines).omit({
  id: true,
  status: true,
  nextMaintenance: true,
}).extend({
  name: z.string().min(1, "Machine name is required"),
  type: z.string().min(1, "Machine type is required"),
  lastMaintenance: z.string().optional(),
  maintenanceIntervalDays: z.coerce.number().int().min(1).optional(),
});

export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type UpdateMachine = z.infer<typeof updateMachineSchema>;
export type Machine = typeof machines.$inferSelect;

// MaintenanceLog schema
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: varchar("id").primaryKey(),
  machineId: varchar("machine_id").notNull(),
  performedBy: text("performed_by").notNull(),
  date: text("date").notNull(), // ISO-8601 date string
  notes: text("notes").notNull(),
});

export const insertMaintenanceLogSchema = createInsertSchema(maintenanceLogs).omit({
  id: true,
}).extend({
  machineId: z.string().min(1, "Machine is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().min(1, "Notes are required"),
  performedBy: z.string().min(1, "Technician name is required"),
});

export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;

// Export the status enum for validation
export { machineStatusEnum };
