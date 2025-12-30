"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLoadEscrow } from "./useLoadEscrow";
import * as React from "react";
import { useTabsContext } from "@/providers/tabs.provider";

export function LoadEscrowDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setActiveTab, setActiveEscrowTab } = useTabsContext();
  const { form, isSubmitting, onSubmit } = useLoadEscrow({
    onSuccess: () => {
      setIsOpen(false);
      setActiveTab("escrow");
      setActiveEscrowTab("fund-escrow");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer">
          Load Escrow
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-full sm:!max-w-xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Escrow</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractIds.0.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract / Escrow ID</FormLabel>
                  <FormControl>
                    <Input placeholder="CAZ6UQX7..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Load Escrow"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
