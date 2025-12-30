"use client";

import { InitializeEscrowForm } from "@/components/tw-blocks/escrows/single-release/initialize-escrow/form/InitializeEscrow";
import { InitializeEscrowForm as InitializeMultiEscrowForm } from "@/components/tw-blocks/escrows/multi-release/initialize-escrow/form/InitializeEscrow";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTabsContext } from "@/providers/tabs.provider";

export function DeployEndpoints() {
  const { activeEscrowType } = useTabsContext();

  return (
    <div className="w-full">
      {/* Card wrapper - hidden on mobile, visible on desktop */}
      <Card className="hidden md:block border shadow-sm">
        <CardHeader className="pb-3 flex justify-between gap-4">
          <div className="flex gap-2 flex-col">
            <CardTitle className="text-xl">Deploy Endpoints</CardTitle>
            <CardDescription>
              Deploy and initialize escrow contracts on the Stellar blockchain
            </CardDescription>
          </div>

          {/* <Button
            type="button"
            variant="outline"
            onClick={handleLoadTemplate}
            className="mb-4"
          >
            Use Template
          </Button> */}
        </CardHeader>
        <CardContent className="p-6">
          {activeEscrowType === "single-release" ? (
            <InitializeEscrowForm />
          ) : (
            <InitializeMultiEscrowForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
