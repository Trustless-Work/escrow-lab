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
import { useLoadEscrowForm } from "../../hooks/load-escrow-form.hook";

export function LoadEscrowForm() {
  const { form, loading, onSubmit } = useLoadEscrowForm();

  return (
    <div className="space-y-6">
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Load Escrow"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
