import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertMachineSchema, type InsertMachine, type Machine } from "@shared/schema";

interface MachineFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine: Machine | null;
  onSubmit: (data: InsertMachine) => Promise<void>;
  isSubmitting: boolean;
}

export function MachineFormDrawer({
  open,
  onOpenChange,
  machine,
  onSubmit,
  isSubmitting,
}: MachineFormDrawerProps) {
  const form = useForm<InsertMachine>({
    resolver: zodResolver(insertMachineSchema),
    defaultValues: {
      name: "",
      type: "",
      lastMaintenance: "",
      maintenanceIntervalDays: 30,
    },
  });

  useEffect(() => {
    if (machine) {
      form.reset({
        name: machine.name,
        type: machine.type,
        lastMaintenance: machine.lastMaintenance || "",
        maintenanceIntervalDays: machine.maintenanceIntervalDays,
      });
    } else {
      form.reset({
        name: "",
        type: "",
        lastMaintenance: "",
        maintenanceIntervalDays: 30,
      });
    }
  }, [machine, form]);

  const handleSubmit = async (data: InsertMachine) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {machine ? "Edit Machine" : "Add Machine"}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Machine Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., CNC Lathe #5"
                      {...field}
                      data-testid="input-machine-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Machine Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., CNC Lathe, Press, Conveyor"
                      {...field}
                      data-testid="input-machine-type"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastMaintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Last Maintenance Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-last-maintenance"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenanceIntervalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Maintenance Interval (Days) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                      data-testid="input-interval-days"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-machine"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
                data-testid="button-save-machine"
              >
                {isSubmitting ? "Saving..." : machine ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
