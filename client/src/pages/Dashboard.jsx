import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Clock, AlertCircle, Wrench, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { MachineTable } from "@/components/MachineTable";
import { AddMaintenanceModal } from "@/components/AddMaintenanceModal";
import { MachineFormDrawer } from "@/components/MachineFormDrawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/constants";
export default function Dashboard() {
    const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
    const [machineDrawerOpen, setMachineDrawerOpen] = useState(false);
    const [editingMachine, setEditingMachine] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [machineToDelete, setMachineToDelete] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const { machines, isLoading, healthyCount, dueSoonCount, overdueCount } = useMaintenanceData();
    const { toast } = useToast();
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            return await apiRequest("PUT", `/api/machines/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.machines });
            toast({
                title: "Success",
                description: "Machine updated successfully",
            });
            setMachineDrawerOpen(false);
            setEditingMachine(null);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update machine",
                variant: "destructive",
            });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await apiRequest("DELETE", `/api/machines/${id}`, undefined);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.machines });
            toast({
                title: "Success",
                description: "Machine deleted successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete machine",
                variant: "destructive",
            });
        },
    });
    const handleViewLogs = (machineId) => {
        const machine = machines.find(m => m.id === machineId);
        toast({
            title: "Maintenance Logs",
            description: `Viewing logs for ${(machine === null || machine === void 0 ? void 0 : machine.name) || 'machine'}`,
        });
    };
    const handleEdit = (machine) => {
        setEditingMachine(machine);
        setMachineDrawerOpen(true);
    };
    const handleDelete = (machineId) => {
        setMachineToDelete(machineId);
        setDeleteDialogOpen(true);
    };
    const confirmDelete = async () => {
        if (machineToDelete) {
            await deleteMutation.mutateAsync(machineToDelete);
            setDeleteDialogOpen(false);
            setMachineToDelete(null);
        }
    };
    const handleMachineSubmit = async (data) => {
        if (editingMachine) {
            await updateMutation.mutateAsync({ id: editingMachine.id, data });
        }
    };
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch('/api/reports/pdf');
            if (!response.ok)
                throw new Error('Failed to generate PDF');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `maintenance-report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast({
                title: "Success",
                description: "PDF report downloaded successfully",
            });
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to download PDF report",
                variant: "destructive",
            });
        }
        finally {
            setIsDownloading(false);
        }
    };
    return (<div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wrench className="h-6 w-6 text-primary"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-app-title">
              Smart Factory Maintenance Tracker
            </h1>
            <p className="text-sm text-muted-foreground">Monitor and maintain your factory equipment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDownloadPDF} disabled={isDownloading} data-testid="button-download-pdf">
            <FileDown className="h-4 w-4 mr-2"/>
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
          <Button onClick={() => setMaintenanceModalOpen(true)} data-testid="button-add-maintenance">
            <Wrench className="h-4 w-4 mr-2"/>
            Record Maintenance
          </Button>
        </div>
      </header>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Healthy Machines" value={healthyCount} icon={CheckCircle2} colorClass="text-status-ok" isLoading={isLoading}/>
          <MetricCard title="Due Soon" value={dueSoonCount} icon={Clock} colorClass="text-status-dueSoon" isLoading={isLoading}/>
          <MetricCard title="Overdue" value={overdueCount} icon={AlertCircle} colorClass="text-status-overdue" isLoading={isLoading}/>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Machine Status</h2>
            <p className="text-sm text-muted-foreground">
              {machines.length} {machines.length === 1 ? 'machine' : 'machines'} total
            </p>
          </div>
          <MachineTable machines={machines} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} onViewLogs={handleViewLogs}/>
        </div>
      </div>

      <AddMaintenanceModal open={maintenanceModalOpen} onOpenChange={setMaintenanceModalOpen} machines={machines}/>

      <MachineFormDrawer open={machineDrawerOpen} onOpenChange={(open) => {
            setMachineDrawerOpen(open);
            if (!open)
                setEditingMachine(null);
        }} machine={editingMachine} onSubmit={handleMachineSubmit} isSubmitting={updateMutation.isPending}/>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the machine
              and all its maintenance logs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);
}
