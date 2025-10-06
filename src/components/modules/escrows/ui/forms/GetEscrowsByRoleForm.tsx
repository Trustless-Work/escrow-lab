"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ResponseDisplay } from "@/components/utils/response-display";
import { useGetEscrowsByRoleForm } from "../../hooks/get-escrows-by-role-form.hook";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";

export function GetEscrowsByRoleForm() {
  const { form, onSubmit, loading, response } = useGetEscrowsByRoleForm();

  return (
    <div className="w-full md:w-3/4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role - Required field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="approver">Approver</SelectItem>
                      <SelectItem value="platformAddress">Platform</SelectItem>
                      <SelectItem value="receiver">Receiver</SelectItem>
                      <SelectItem value="releaseSigner">
                        Release Signer
                      </SelectItem>
                      <SelectItem value="disputeResolver">
                        Dispute Resolver
                      </SelectItem>
                      <SelectItem value="serviceProvider">
                        Service Provider
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Address - Required field */}
            <FormField
              control={form.control}
              name="roleAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter wallet address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Optional Grouped Fields */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Optional Filters</Label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  form.reset({
                    role: form.getValues("role"),
                    roleAddress: form.getValues("roleAddress"),
                    page: 1,
                    orderDirection: "desc",
                    orderBy: "createdAt",
                    validateOnChain: true,
                    type: form.getValues("type"),
                  });
                }}
              >
                Clear Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Page */}
              <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        value={
                          field.value === undefined || isNaN(field.value)
                            ? ""
                            : field.value || ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Direction */}
              <FormField
                control={form.control}
                name="orderDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Direction</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order By */}
              <FormField
                control={form.control}
                name="orderBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order By</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select order by" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="createdAt">Created At</SelectItem>
                        <SelectItem value="updatedAt">Updated At</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="working">Working</SelectItem>
                        <SelectItem value="pendingRelease">
                          Pending Release
                        </SelectItem>
                        <SelectItem value="released">Released</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="inDispute">In Dispute</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="single-release">
                          Single Release
                        </SelectItem>
                        <SelectItem value="multi-release">
                          Multi Release
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Min Amount */}
              <FormField
                control={form.control}
                name="minAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={
                          field.value === undefined || isNaN(field.value)
                            ? ""
                            : field.value || ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Amount */}
              <FormField
                control={form.control}
                name="maxAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="999999"
                        value={
                          field.value === undefined || isNaN(field.value)
                            ? ""
                            : field.value || ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Escrow Title"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Engagement ID */}
              <FormField
                control={form.control}
                name="engagementId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engagement ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ENG12345"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Active Checkbox */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-background">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">
                        Active Escrows Only
                      </FormLabel>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Filter to show only currently active escrows
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Validate On Chain Checkbox */}
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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Fetching..." : "Get Escrows by Role"}
          </Button>
        </form>
      </Form>

      <ResponseDisplay
        response={response as GetEscrowsFromIndexerResponse[] | null}
      />
    </div>
  );
}
