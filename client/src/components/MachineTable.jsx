import { Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { format, parseISO } from "date-fns";
import { formatDistanceToNow } from "date-fns";
export function MachineTable({ machines, isLoading, onEdit, onDelete, onViewLogs }) {
    if (isLoading) {
        return (<div className="space-y-3">
        {[...Array(5)].map((_, i) => (<div key={i} className="h-16 bg-muted animate-pulse rounded-md"/>))}
      </div>);
    }
    if (machines.length === 0) {
        return (<div className="text-center py-12 bg-card rounded-lg border border-card-border">
        <p className="text-muted-foreground text-lg">No machines found</p>
        <p className="text-sm text-muted-foreground mt-2">Add your first machine to get started</p>
      </div>);
    }
    return (<div className="rounded-lg border border-card-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Machine Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Last Maintenance</TableHead>
              <TableHead className="font-semibold">Next Maintenance</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (<TableRow key={machine.id} className="hover-elevate" data-testid={`row-machine-${machine.id}`}>
                <TableCell className="font-semibold text-base" data-testid={`text-machine-name-${machine.id}`}>
                  {machine.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{machine.type}</TableCell>
                <TableCell>
                  {machine.lastMaintenance ? (<div className="space-y-0.5">
                      <div>{format(parseISO(machine.lastMaintenance), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(parseISO(machine.lastMaintenance), { addSuffix: true })}
                      </div>
                    </div>) : (<span className="text-muted-foreground text-sm">Never</span>)}
                </TableCell>
                <TableCell>
                  {machine.nextMaintenance ? (<div className="space-y-0.5">
                      <div>{format(parseISO(machine.nextMaintenance), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(parseISO(machine.nextMaintenance), { addSuffix: true })}
                      </div>
                    </div>) : (<span className="text-muted-foreground text-sm">Not scheduled</span>)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={machine.status}/>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onViewLogs(machine.id)} data-testid={`button-view-logs-${machine.id}`}>
                      <FileText className="h-4 w-4"/>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(machine)} data-testid={`button-edit-${machine.id}`}>
                      <Edit className="h-4 w-4"/>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(machine.id)} data-testid={`button-delete-${machine.id}`}>
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </div>
    </div>);
}
