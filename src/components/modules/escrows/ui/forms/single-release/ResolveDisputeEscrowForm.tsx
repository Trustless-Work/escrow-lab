"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResolveDisputeEscrowForm } from "../../../hooks/single-release/resolve-dispute-escrow-form.hook";
import { useEscrowContext } from "@/providers/escrow.provider";
import { ResponseDisplay } from "@/components/utils/response-display";

export function ResolveDisputeEscrowForm() {
  const { form, loading, response, onSubmit } = useResolveDisputeEscrowForm();
  const { escrow } = useEscrowContext();

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract / Escrow ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CAZ6UQX7..."
                    {...field}
                    disabled={!!escrow?.contractId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disputeResolver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispute Resolver Address</FormLabel>
                <FormControl>
                  <Input
                    disabled={!!escrow?.roles.disputeResolver}
                    placeholder="GDISPUTE...XYZ"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Distributions</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  form.setValue("distributions", [
                    ...form.getValues("distributions"),
                    { address: "", amount: "" },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Distribution
              </Button>
            </div>

            {form
              .watch("distributions")
              .map(
                (
                  dist: { address: string; amount: string | number },
                  index: number
                ) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`distributions.${index}.address` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="G..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`distributions.${index}.amount` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="100"
                                    {...field}
                                    onChange={(e) => {
                                      let rawValue = e.target.value;
                                      rawValue = rawValue.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );

                                      if (rawValue.split(".").length > 2) {
                                        rawValue = rawValue.slice(0, -1);
                                      }
                                      field.onChange(rawValue);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch("distributions").length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const current = form.getValues("distributions");
                              form.setValue(
                                "distributions",
                                current.filter(
                                  (
                                    _item: {
                                      address: string;
                                      amount: string | number;
                                    },
                                    i: number
                                  ) => i !== index
                                )
                              );
                            }}
                            className="mt-8"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resolving..." : "Resolve Dispute"}
          </Button>
        </form>
      </Form>

      <ResponseDisplay response={response} />
    </div>
  );
}
