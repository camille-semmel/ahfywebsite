import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const seatRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  organization: z
    .string()
    .trim()
    .min(1, { message: "Organization is required" })
    .max(100, { message: "Organization must be less than 100 characters" }),
});

type SeatRequestFormData = z.infer<typeof seatRequestSchema>;

interface SeatRequestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSeats: {
    used: number;
    total: number;
  };
}

const SeatRequestFormDialog = ({
  open,
  onOpenChange,
  currentSeats,
}: SeatRequestFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SeatRequestFormData>({
    resolver: zodResolver(seatRequestSchema),
    defaultValues: {
      name: "",
      organization: "",
    },
  });

  const onSubmit = async (data: SeatRequestFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting seat request:", data);

      const { data: responseData, error } = await supabase.functions.invoke(
        "send-seat-request",
        {
          body: {
            name: data.name,
            organization: data.organization,
            currentSeats: currentSeats,
          },
        }
      );

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      console.log("Request sent successfully:", responseData);

      toast({
        title: "Request Sent!",
        description: "Your seat increase request has been submitted successfully. We'll get back to you soon.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to send request:", error);
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Additional Seats</DialogTitle>
          <DialogDescription>
            Fill in your details to request more student seats for your institution.
            <div className="mt-2 text-sm font-medium text-foreground">
              Current: {currentSeats.used}/{currentSeats.total} seats
            </div>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="University Name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SeatRequestFormDialog;
