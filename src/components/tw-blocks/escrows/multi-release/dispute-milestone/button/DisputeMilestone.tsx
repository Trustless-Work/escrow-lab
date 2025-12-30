import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import {
  MultiReleaseStartDisputePayload,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type DisputeMilestoneButtonProps = {
  milestoneIndex: number | string;
};

export const DisputeMilestoneButton = ({
  milestoneIndex,
}: DisputeMilestoneButtonProps) => {
  const { startDispute } = useEscrowsMutations();
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleClick() {
    try {
      setIsSubmitting(true);

      /**
       * Create the payload for the dispute escrow mutation
       *
       * @returns The payload for the dispute escrow mutation
       */
      const payload: MultiReleaseStartDisputePayload = {
        contractId: selectedEscrow?.contractId || "",
        signer: walletAddress || "",
        milestoneIndex: String(milestoneIndex),
      };

      /**
       * Call the dispute escrow mutation
       *
       * @param payload - The payload for the dispute escrow mutation
       * @param type - The type of the escrow
       * @param address - The address of the escrow
       */
      await startDispute.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress || "",
      });

      toast.success("Milestone disputed successfully");

      updateEscrow({
        ...selectedEscrow,
        milestones: selectedEscrow?.milestones.map((milestone, index) => {
          if (index === Number(milestoneIndex)) {
            return {
              ...milestone,
              flags: {
                ...(milestone as MultiReleaseMilestone).flags,
                disputed: true,
              },
            };
          }
          return milestone;
        }),
      });
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 mb-4">
        <Link
          className="flex-1"
          href="https://docs.trustlesswork.com/trustless-work/api-reference/getting-started#disputes"
          target="_blank"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h2 className="text-xl font-semibold">Dispute Milestone</h2>
          </div>
          <p className="text-muted-foreground mt-1">Dispute a milestone</p>
        </Link>
      </Card>

      <Button
        type="button"
        disabled={isSubmitting || !selectedEscrow?.balance}
        onClick={handleClick}
        className="cursor-pointer w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-2">Disputing...</span>
          </div>
        ) : (
          "Dispute Milestone"
        )}
      </Button>
    </>
  );
};
