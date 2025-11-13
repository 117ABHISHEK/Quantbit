import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertMaintenanceLogSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/constants";
import { formatISO } from "date-fns";
export function AddMaintenanceModal({ open, onOpenChange, machines }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(insertMaintenanceLogSchema),
        defaultValues: {
            machineId: "",
            performedBy: "",
            date: formatISO(new Date(), { representation: 'date' }),
            notes: "",
        },
    });
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await apiRequest("POST", "/api/maintenance", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.machines });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maintenanceLogs() });
            toast({
                title: "Success",
                description: "Maintenance log recorded successfully",
            });
            form.reset();
            onOpenChange(false);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to record maintenance log",
                variant: "destructive",
            });
        },
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await mutation.mutateAsync(data);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="dialog-add-maintenance">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Record Maintenance</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="machineId" render={({ field }) => (<FormItem>
                  <FormLabel className="font-semibold">
                    Machine <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-machine">
                        <SelectValue placeholder="Select a machine"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {machines.map((machine) => (<SelectItem key={machine.id} value={machine.id}>
                          {machine.name} ({machine.type})
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="performedBy" render={({ field }) => (<FormItem>
                  <FormLabel className="font-semibold">
                    Technician Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter technician name" {...field} data-testid="input-performed-by"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="date" render={({ field }) => (<FormItem>
                  <FormLabel className="font-semibold">
                    Maintenance Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-date"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <FormField control={form.control} name="notes" render={({ field }) => (<FormItem>
                  <FormLabel className="font-semibold">
                    Notes <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter maintenance details..." className="min-h-[120px] resize-none" {...field} data-testid="input-notes"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>)}/>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting} data-testid="button-submit-maintenance">
                {isSubmitting ? "Recording..." : "Record Maintenance"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>);
}
