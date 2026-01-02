import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDisputeMilestone } from "./useDisputeMilestone";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const DisputeMilestoneForm = () => {
  const { form, handleSubmit, isSubmitting } = useDisputeMilestone();
  const { selectedEscrow } = useEscrowContext();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
        <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 mb-4">
          <Link
            className="flex-1"
            href="https://docs.trustlesswork.com/trustless-work/api-reference/getting-started#disputes"
            target="_blank"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-semibold">Dispute Milestone</h2>
            </div>
            <p className="text-muted-foreground mt-1">Dispute a milestone</p>
          </Link>
        </Card>

        <FormField
          control={form.control}
          name="milestoneIndex"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Milestone
                <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(e) => {
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedEscrow?.milestones || []).map((m, idx) => (
                      <SelectItem key={`ms-${idx}`} value={String(idx)}>
                        {m?.description || `Milestone ${idx + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !selectedEscrow?.balance}
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Disputing...</span>
              </div>
            ) : (
              "Dispute Milestone"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
