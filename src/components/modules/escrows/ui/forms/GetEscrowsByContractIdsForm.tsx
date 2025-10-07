import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ResponseDisplay } from "@/components/utils/response-display";
import { useGetEscrowsByContractIdsForm } from "../../hooks/get-escrows-by-contract-ids.hook";

export function GetEscrowsByContractIdsForm() {
  const { form, loading, response, onSubmit, fields, append, remove } =
    useGetEscrowsByContractIdsForm();

  return (
    <div className="w-full md:w-3/4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Contract Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Contract / Escrow IDs</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>

            {fields.map(
              (field: { id: string; value: string }, index: number) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`contractIds.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Contract / Escrow ID ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
          </div>

          {/* Validate On Chain Checkbox */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="validateOnChain"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-base font-medium">
                      Validate on Chain
                    </FormLabel>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Verify escrow data against the blockchain for enhanced
                      security and accuracy
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Fetching..." : "Get Escrows"}
          </Button>
        </form>
      </Form>

      <ResponseDisplay response={response} />
    </div>
  );
}
