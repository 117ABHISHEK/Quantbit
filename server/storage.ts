import {
  type Machine,
  type InsertMachine,
  type MaintenanceLog,
  type InsertMaintenanceLog,
  MachineStatus,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { calculateMachineStatus, calculateNextMaintenance } from "../client/src/services/status";

export interface IStorage {
  getMachines(): Promise<Machine[]>;
  getMachine(id: string): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: string, machine: InsertMachine): Promise<Machine>;
  deleteMachine(id: string): Promise<void>;
  
  getMaintenanceLogs(machineId?: string): Promise<MaintenanceLog[]>;
  createMaintenanceLog(log: InsertMaintenanceLog): Promise<MaintenanceLog>;
  
  updateMachineStatus(machineId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private machines: Map<string, Machine>;
  private maintenanceLogs: Map<string, MaintenanceLog>;

  constructor() {
    this.machines = new Map();
    this.maintenanceLogs = new Map();
    this.seedData();
  }

  private seedData() {
    const today = new Date();
    const sampleMachines: Omit<Machine, 'id'>[] = [
      {
        name: "CNC Lathe #1",
        type: "CNC Lathe",
        lastMaintenance: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: MachineStatus.OVERDUE,
        maintenanceIntervalDays: 30,
      },
      {
        name: "Hydraulic Press #2",
        type: "Hydraulic Press",
        lastMaintenance: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: MachineStatus.DUE_SOON,
        maintenanceIntervalDays: 30,
      },
      {
        name: "Conveyor Belt #3",
        type: "Conveyor System",
        lastMaintenance: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: MachineStatus.OK,
        maintenanceIntervalDays: 30,
      },
      {
        name: "Welding Robot #4",
        type: "Robotic Welder",
        lastMaintenance: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: MachineStatus.OK,
        maintenanceIntervalDays: 30,
      },
      {
        name: "Assembly Line #5",
        type: "Assembly Line",
        lastMaintenance: new Date(today.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextMaintenance: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: MachineStatus.OVERDUE,
        maintenanceIntervalDays: 30,
      },
    ];

    sampleMachines.forEach((machine) => {
      const id = randomUUID();
      this.machines.set(id, { ...machine, id });
    });
  }

  async getMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: string): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const id = randomUUID();
    
    let nextMaintenance: string | null = null;
    let status: string = MachineStatus.OK;
    
    if (insertMachine.lastMaintenance) {
      nextMaintenance = calculateNextMaintenance(
        insertMachine.lastMaintenance,
        insertMachine.maintenanceIntervalDays
      );
      status = calculateMachineStatus(nextMaintenance);
    }
    
    const machine: Machine = {
      id,
      name: insertMachine.name,
      type: insertMachine.type,
      lastMaintenance: insertMachine.lastMaintenance || null,
      nextMaintenance,
      status,
      maintenanceIntervalDays: insertMachine.maintenanceIntervalDays || 30,
    };
    
    this.machines.set(id, machine);
    return machine;
  }

  async updateMachine(id: string, updateData: InsertMachine): Promise<Machine> {
    const existing = this.machines.get(id);
    if (!existing) {
      throw new Error("Machine not found");
    }

    let nextMaintenance: string | null = null;
    let status: string = MachineStatus.OK;
    
    if (updateData.lastMaintenance) {
      nextMaintenance = calculateNextMaintenance(
        updateData.lastMaintenance,
        updateData.maintenanceIntervalDays || existing.maintenanceIntervalDays
      );
      status = calculateMachineStatus(nextMaintenance);
    }

    const machine: Machine = {
      id,
      name: updateData.name,
      type: updateData.type,
      lastMaintenance: updateData.lastMaintenance || null,
      nextMaintenance,
      status,
      maintenanceIntervalDays: updateData.maintenanceIntervalDays || existing.maintenanceIntervalDays,
    };

    this.machines.set(id, machine);
    return machine;
  }

  async deleteMachine(id: string): Promise<void> {
    this.machines.delete(id);
    Array.from(this.maintenanceLogs.entries())
      .filter(([_, log]) => log.machineId === id)
      .forEach(([logId]) => this.maintenanceLogs.delete(logId));
  }

  async getMaintenanceLogs(machineId?: string): Promise<MaintenanceLog[]> {
    const logs = Array.from(this.maintenanceLogs.values());
    if (machineId) {
      return logs.filter(log => log.machineId === machineId);
    }
    return logs;
  }

  async createMaintenanceLog(insertLog: InsertMaintenanceLog): Promise<MaintenanceLog> {
    const id = randomUUID();
    const log: MaintenanceLog = {
      ...insertLog,
      id,
    };
    
    this.maintenanceLogs.set(id, log);
    
    const machine = this.machines.get(insertLog.machineId);
    if (machine) {
      const nextMaintenance = calculateNextMaintenance(insertLog.date, machine.maintenanceIntervalDays);
      const status = calculateMachineStatus(nextMaintenance);
      
      const updatedMachine: Machine = {
        ...machine,
        lastMaintenance: insertLog.date,
        nextMaintenance,
        status,
      };
      
      this.machines.set(insertLog.machineId, updatedMachine);
    }
    
    return log;
  }

  async updateMachineStatus(machineId: string): Promise<void> {
    const machine = this.machines.get(machineId);
    if (machine && machine.nextMaintenance) {
      const status = calculateMachineStatus(machine.nextMaintenance);
      this.machines.set(machineId, { ...machine, status });
    }
  }
}

export const storage = new MemStorage();
