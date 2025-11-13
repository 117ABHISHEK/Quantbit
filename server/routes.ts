import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMachineSchema, insertMaintenanceLogSchema, MachineStatus } from "@shared/schema";
import PDFDocument from "pdfkit";
import { format, parseISO } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/machines", async (_req, res) => {
    try {
      const machines = await storage.getMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch machines" });
    }
  });

  app.get("/api/machines/:id", async (req, res) => {
    try {
      const machine = await storage.getMachine(req.params.id);
      if (!machine) {
        return res.status(404).json({ error: "Machine not found" });
      }
      res.json(machine);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch machine" });
    }
  });

  app.post("/api/machines", async (req, res) => {
    try {
      const validated = insertMachineSchema.parse(req.body);
      const machine = await storage.createMachine(validated);
      res.status(201).json(machine);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid machine data" });
    }
  });

  app.put("/api/machines/:id", async (req, res) => {
    try {
      const validated = insertMachineSchema.parse(req.body);
      const machine = await storage.updateMachine(req.params.id, validated);
      res.json(machine);
    } catch (error: any) {
      if (error.message === "Machine not found") {
        return res.status(404).json({ error: "Machine not found" });
      }
      res.status(400).json({ error: error.message || "Invalid machine data" });
    }
  });

  app.delete("/api/machines/:id", async (req, res) => {
    try {
      await storage.deleteMachine(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete machine" });
    }
  });

  app.get("/api/maintenance", async (req, res) => {
    try {
      const machineId = req.query.machineId as string | undefined;
      const logs = await storage.getMaintenanceLogs(machineId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance logs" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const validated = insertMaintenanceLogSchema.parse(req.body);
      const log = await storage.createMaintenanceLog(validated);
      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid maintenance log data" });
    }
  });

  app.get("/api/maintenance/overdue", async (_req, res) => {
    try {
      const machines = await storage.getMachines();
      const overdue = machines.filter(m => m.status === MachineStatus.OVERDUE);
      res.json(overdue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch overdue machines" });
    }
  });

  app.get("/api/reports/pdf", async (_req, res) => {
    try {
      const machines = await storage.getMachines();
      
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=maintenance-report.pdf');
      
      doc.pipe(res);
      
      doc.fontSize(20).font('Helvetica-Bold').text('Factory Maintenance Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, { align: 'center' });
      doc.moveDown(2);
      
      doc.fontSize(14).font('Helvetica-Bold').text('Machine Maintenance Schedule');
      doc.moveDown();
      
      const tableTop = doc.y;
      const colWidths = {
        name: 150,
        type: 120,
        nextMaintenance: 120,
        status: 80,
      };
      
      doc.fontSize(10).font('Helvetica-Bold');
      let xPos = 50;
      doc.text('Machine Name', xPos, tableTop, { width: colWidths.name, continued: false });
      xPos += colWidths.name;
      doc.text('Type', xPos, tableTop, { width: colWidths.type, continued: false });
      xPos += colWidths.type;
      doc.text('Next Maintenance', xPos, tableTop, { width: colWidths.nextMaintenance, continued: false });
      xPos += colWidths.nextMaintenance;
      doc.text('Status', xPos, tableTop, { width: colWidths.status, continued: false });
      
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      
      doc.font('Helvetica');
      machines.forEach((machine) => {
        const yPos = doc.y;
        
        if (yPos > 700) {
          doc.addPage();
        }
        
        xPos = 50;
        doc.text(machine.name, xPos, yPos, { width: colWidths.name, continued: false });
        xPos += colWidths.name;
        doc.text(machine.type, xPos, yPos, { width: colWidths.type, continued: false });
        xPos += colWidths.type;
        
        const nextMaintText = machine.nextMaintenance 
          ? format(parseISO(machine.nextMaintenance), 'MMM dd, yyyy')
          : 'Not scheduled';
        doc.text(nextMaintText, xPos, yPos, { width: colWidths.nextMaintenance, continued: false });
        xPos += colWidths.nextMaintenance;
        doc.text(machine.status, xPos, yPos, { width: colWidths.status, continued: false });
        
        doc.moveDown(0.8);
      });
      
      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('Summary');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      
      const healthyCount = machines.filter(m => m.status === MachineStatus.OK).length;
      const dueSoonCount = machines.filter(m => m.status === MachineStatus.DUE_SOON).length;
      const overdueCount = machines.filter(m => m.status === MachineStatus.OVERDUE).length;
      
      doc.text(`Total Machines: ${machines.length}`);
      doc.text(`Healthy (OK): ${healthyCount}`);
      doc.text(`Due Soon: ${dueSoonCount}`);
      doc.text(`Overdue: ${overdueCount}`);
      
      doc.end();
    } catch (error: any) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: "Failed to generate PDF report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
