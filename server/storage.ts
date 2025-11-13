import {
  type Machine,
  type InsertMachine,
  type MaintenanceLog,
  type InsertMaintenanceLog,
  MachineStatus,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { calculateMachineStatus, calculateNextMaintenance } from "../client/src/services/status";
import { MongoClient, ObjectId } from "mongodb";

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

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private dbName: string;

  constructor(client: MongoClient, dbName = "quantbit") {
    this.client = client;
    this.dbName = dbName;
  }

  private collection<T>(name: string) {
    return this.client.db(this.dbName).collection<T>(name);
  }

  async getMachines(): Promise<Machine[]> {
    const items = await this.collection<Machine>("machines").find().toArray();
    return items.map((it: any) => ({ ...it, id: it._id.toString() }));
  }

  async getMachine(id: string): Promise<Machine | undefined> {
    const objId = new ObjectId(id);
    const it = await this.collection<Machine>("machines").findOne({ _id: objId });
    if (!it) return undefined;
    return { ...it, id: it._id.toString() } as unknown as Machine;
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const nowNext = insertMachine.lastMaintenance
      ? calculateNextMaintenance(insertMachine.lastMaintenance, insertMachine.maintenanceIntervalDays)
      : null;
    const status = nowNext ? calculateMachineStatus(nowNext) : MachineStatus.OK;

    const doc: any = {
      name: insertMachine.name,
      type: insertMachine.type,
      lastMaintenance: insertMachine.lastMaintenance || null,
      nextMaintenance: nowNext,
      status,
      maintenanceIntervalDays: insertMachine.maintenanceIntervalDays || 30,
    };

    const res = await this.collection("machines").insertOne(doc);
    return { ...doc, id: res.insertedId.toString() } as unknown as Machine;
  }

  async updateMachine(id: string, updateData: InsertMachine): Promise<Machine> {
    const objId = new ObjectId(id);
    const existing = await this.collection<any>("machines").findOne({ _id: objId });
    if (!existing) throw new Error("Machine not found");

    const nextMaintenance = updateData.lastMaintenance
      ? calculateNextMaintenance(updateData.lastMaintenance, updateData.maintenanceIntervalDays || existing.maintenanceIntervalDays)
      : existing.nextMaintenance;
    const status = nextMaintenance ? calculateMachineStatus(nextMaintenance) : existing.status;

    const updated = {
      name: updateData.name,
      type: updateData.type,
      lastMaintenance: updateData.lastMaintenance || null,
      nextMaintenance,
      status,
      maintenanceIntervalDays: updateData.maintenanceIntervalDays || existing.maintenanceIntervalDays,
    };

    await this.collection("machines").updateOne({ _id: objId }, { $set: updated });
    return { ...updated, id } as unknown as Machine;
  }

  async deleteMachine(id: string): Promise<void> {
    const objId = new ObjectId(id);
    await this.collection("machines").deleteOne({ _id: objId });
    await this.collection("maintenanceLogs").deleteMany({ machineId: id });
  }

  async getMaintenanceLogs(machineId?: string): Promise<MaintenanceLog[]> {
    const filter: any = {};
    if (machineId) filter.machineId = machineId;
    const items = await this.collection<any>("maintenanceLogs").find(filter).toArray();
    return items.map((it: any) => ({ ...it, id: it._id.toString() }));
  }

  async createMaintenanceLog(insertLog: InsertMaintenanceLog): Promise<MaintenanceLog> {
    const doc: any = { ...insertLog };
    const res = await this.collection("maintenanceLogs").insertOne(doc);

    // update machine next maintenance and status
    const machineDoc = await this.collection<any>("machines").findOne({ _id: new ObjectId(insertLog.machineId) });
    if (machineDoc) {
      const nextMaintenance = calculateNextMaintenance(insertLog.date, machineDoc.maintenanceIntervalDays);
      const status = calculateMachineStatus(nextMaintenance);
      await this.collection("machines").updateOne(
        { _id: new ObjectId(insertLog.machineId) },
        { $set: { lastMaintenance: insertLog.date, nextMaintenance, status } }
      );
    }

    return { ...doc, id: res.insertedId.toString() } as unknown as MaintenanceLog;
  }

  async updateMachineStatus(machineId: string): Promise<void> {
    const machineDoc = await this.collection<any>("machines").findOne({ _id: new ObjectId(machineId) });
    if (machineDoc && machineDoc.nextMaintenance) {
      const status = calculateMachineStatus(machineDoc.nextMaintenance);
      await this.collection("machines").updateOne({ _id: new ObjectId(machineId) }, { $set: { status } });
    }
  }
}

// choose storage based on environment variable MONGO_URL, fallback to MemStorage
let storageImpl: IStorage;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

async function initStorage(): Promise<IStorage> {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    // ping to ensure connection
    await client.db().command({ ping: 1 });
    return new MongoStorage(client, process.env.MONGO_DB_NAME || "quantbit");
  } catch (err) {
    // if mongo not available, fallback to memory storage
    return new MemStorage();
  }
}

// simple eager initialization: consumers import { storage } and get a promise-like
// but to keep current API, export a storage proxy that buffers until init completes
class StorageProxy implements IStorage {
  private implPromise: Promise<IStorage>;
  constructor() {
    this.implPromise = initStorage();
  }
  private async impl() { return this.implPromise; }
  async getMachines() { return (await this.impl()).getMachines(); }
  async getMachine(id: string) { return (await this.impl()).getMachine(id); }
  async createMachine(m: InsertMachine) { return (await this.impl()).createMachine(m); }
  async updateMachine(id: string, m: InsertMachine) { return (await this.impl()).updateMachine(id, m); }
  async deleteMachine(id: string) { return (await this.impl()).deleteMachine(id); }
  async getMaintenanceLogs(mid?: string) { return (await this.impl()).getMaintenanceLogs(mid); }
  async createMaintenanceLog(l: InsertMaintenanceLog) { return (await this.impl()).createMaintenanceLog(l); }
  async updateMachineStatus(id: string) { return (await this.impl()).updateMachineStatus(id); }
}

export const storage: IStorage = new StorageProxy();
