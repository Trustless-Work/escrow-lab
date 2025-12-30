import * as React from "react";
import { Button } from "@/components/ui/button";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import {
  MultiReleaseReleaseFundsPayload,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { useEscrowDialogs } from "@/components/tw-blocks/providers/EscrowDialogsProvider";
import { useEscrowAmountContext } from "@/components/tw-blocks/providers/EscrowAmountProvider";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type ReleaseMilestoneButtonProps = {
  milestoneIndex: number | string;
};

export const ReleaseMilestoneButton = ({
  milestoneIndex,
}: ReleaseMilestoneButtonProps) => {
  const { releaseFunds } = useEscrowsMutations();
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const dialogStates = useEscrowDialogs();
  const { setAmounts, setLastReleasedMilestoneIndex } =
    useEscrowAmountContext();
  const { walletAddress } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleClick() {
    try {
      setIsSubmitting(true);

      /**
       * Create the payload for the release escrow mutation
       *
       * @returns The payload for the release escrow mutation
       */
      const payload: MultiReleaseReleaseFundsPayload = {
        contractId: selectedEscrow?.contractId || "",
        releaseSigner: walletAddress || "",
        milestoneIndex: String(milestoneIndex),
      };

      /**
       * Call the release escrow mutation
       *
       * @param payload - The payload for the release escrow mutation
       * @param type - The type of the escrow
       * @param address - The address of the escrow
       */
      await releaseFunds.mutateAsync({
        payload,
        type: "multi-release",
        address: walletAddress || "",
      });

      toast.success("Milestone released successfully");

      // Ensure amounts are up to date for the success dialog
      if (selectedEscrow) {
        const milestone = selectedEscrow.milestones?.[Number(milestoneIndex)];
        const releasedAmount = Number(
          (milestone as MultiReleaseMilestone | undefined)?.amount || 0
        );
        const platformFee = Number(selectedEscrow.platformFee || 0);
        setAmounts(releasedAmount, platformFee);
      }

      updateEscrow({
        ...selectedEscrow,
        milestones: selectedEscrow?.milestones.map((milestone, index) => {
          if (index === Number(milestoneIndex)) {
            return {
              ...milestone,
              flags: {
                ...(milestone as MultiReleaseMilestone).flags,
                released: true,
              },
            };
          }
          return milestone;
        }),
        balance: (selectedEscrow?.balance || 0) - (selectedEscrow?.amount || 0),
      });

      // Remember which milestone was released for the success dialog
      setLastReleasedMilestoneIndex(Number(milestoneIndex));

      // Open success dialog
      dialogStates.successRelease.setIsOpen(true);
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
          href="https://docs.trustlesswork.com/trustless-work/api-reference/getting-started#finalization"
          target="_blank"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h2 className="text-xl font-semibold">Release Milestone</h2>
          </div>
          <p className="text-muted-foreground mt-1">Release a milestone</p>
        </Link>
      </Card>

      <Button
        type="button"
        disabled={isSubmitting}
        onClick={handleClick}
        className="cursor-pointer w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-2">Releasing...</span>
          </div>
        ) : (
          "Release Milestone"
        )}
      </Button>
    </>
  );
};
