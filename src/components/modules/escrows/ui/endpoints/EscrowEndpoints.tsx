"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTabsContext } from "@/providers/tabs.provider";
import { Button } from "@/components/ui/button";
import { EscrowTabs } from "../../../../tabs/EscrowTabs";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";

export function EscrowEndpoints() {
  const { clearEscrow, selectedEscrow } = useEscrowContext();
  const { setActiveTab } = useTabsContext();

  return (
    <div className="w-full">
      {/* Card wrapper - hidden on mobile, visible on desktop */}
      <Card className="hidden md:block border shadow-sm">
        <CardHeader className="pb-3 flex justify-between gap-4">
          <div className="flex gap-2 flex-col">
            <CardTitle className="text-xl">Escrow Endpoints</CardTitle>
            <CardDescription>
              Manage escrow contracts, milestones, and funds
            </CardDescription>
          </div>

          {selectedEscrow && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                clearEscrow();
                setActiveTab("deploy");
              }}
              className="mb-4"
            >
              Reset Escrow
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <EscrowTabs />
        </CardContent>
      </Card>
    </div>
  );
}
