"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import { MainTabs } from "../../../tabs/MainTabs";
import { ConnectWalletWarning } from "./ConnectWalletWarning";
import { EscrowTypeTabs } from "../../../tabs/EscrowTypeTabs";
import { LoadEscrowDialog } from "@/components/tw-blocks/escrows/load-escrow/dialog/LoadEscrow";

export function DashboardView() {
  const { walletAddress } = useWalletContext();

  return (
    <div className="space-y-8">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Escrow Types</h1>
            <LoadEscrowDialog />
          </div>
          <EscrowTypeTabs />
        </CardHeader>
        <CardContent className="px-0">
          {walletAddress ? <MainTabs /> : <ConnectWalletWarning />}
        </CardContent>
      </Card>
    </div>
  );
}
