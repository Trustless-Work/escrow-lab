"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWalletContext } from "@/providers/wallet.provider";
import { MainTabs } from "../../../../tabs/MainTabs";
import { ConnectWalletWarning } from "../ConnectWalletWarning";
import { EscrowTypeTabs } from "../../../../tabs/EscrowTypeTabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadEscrowForm } from "../forms/LoadEscrowForm";
import { useDialogsContext } from "@/providers/dialogs.provider";

export function Dashboard() {
  const { loadEscrowDialogOpen, setLoadEscrowDialogOpen } = useDialogsContext();
  const { walletAddress } = useWalletContext();

  return (
    <div className="space-y-8">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Escrow Types</h1>
            <Dialog
              open={loadEscrowDialogOpen}
              onOpenChange={setLoadEscrowDialogOpen}
            >
              {walletAddress && (
                <DialogTrigger asChild>
                  <Button variant="outline">Load Escrow</Button>
                </DialogTrigger>
              )}

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load an Existing Escrow</DialogTitle>
                </DialogHeader>
                <LoadEscrowForm />
              </DialogContent>
            </Dialog>
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
