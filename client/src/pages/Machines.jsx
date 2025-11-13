import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MachineTable } from "@/components/MachineTable";
import { MachineFormDrawer } from "@/components/MachineFormDrawer";
import { useMaintenanceData } from "@/hooks/useMaintenanceData";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/constants";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
export default function Machines() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingMachine, setEditingMachine] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [machineToDelete, setMachineToDelete] = useState(null);
    const { machines, isLoading } = useMaintenanceData();
    const { toast } = useToast();
    const createMutation = useMutation({
        mutationFn: async (data) => {
            return await apiRequest("POST", "/api/machines", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.machines });
            toast({
                title: "Success",
                description: "Machine created successfully",
            });
            setDrawerOpen(false);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to create machine",
                variant: "destructive",
            });
        },
    });
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
            setDrawerOpen(false);
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
    const handleSubmit = async (data) => {
        if (editingMachine) {
            await updateMutation.mutateAsync({ id: editingMachine.id, data });
        }
        else {
            await createMutation.mutateAsync(data);
        }
    };
    const handleEdit = (machine) => {
        setEditingMachine(machine);
        setDrawerOpen(true);
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
    const handleViewLogs = (machineId) => {
        toast({
            title: "Maintenance Logs",
            description: `Viewing logs for machine ${machineId}`,
        });
    };
    const handleAddNew = () => {
        setEditingMachine(null);
        setDrawerOpen(true);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Machine Management</h2>
          <p className="text-muted-foreground mt-1">
            Add, edit, or remove machines from your factory
          </p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-machine">
          <Plus className="h-4 w-4 mr-2"/>
          Add Machine
        </Button>
      </div>

      <MachineTable machines={machines} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} onViewLogs={handleViewLogs}/>

      <MachineFormDrawer open={drawerOpen} onOpenChange={(open) => {
            setDrawerOpen(open);
            if (!open)
                setEditingMachine(null);
        }} machine={editingMachine} onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending}/>

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
