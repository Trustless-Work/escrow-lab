import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFundEscrow } from "./useFundEscrow";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const FundEscrowForm = () => {
  const { form, handleSubmit, isSubmitting } = useFundEscrow();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
        <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
          <Link
            className="flex-1"
            href="https://docs.trustlesswork.com/trustless-work/api-reference/getting-started#funding"
            target="_blank"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-semibold">Fund Escrow</h2>
            </div>
            <p className="text-muted-foreground mt-1">
              Set the amount to fund the escrow
            </p>
          </Link>
        </Card>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="ml-2">Funding...</span>
              </div>
            ) : (
              "Fund"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
