import { DollarSign, Landmark, Percent, PiggyBank } from "lucide-react";
import {
  GetEscrowsFromIndexerResponse as Escrow,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { useTabsContext } from "@/providers/tabs.provider";

interface FinancialDetailsSectionProps {
  selectedEscrow: Escrow | null;
}

export const FinancialDetailsSection = ({
  selectedEscrow,
}: FinancialDetailsSectionProps) => {
  const { activeEscrowType } = useTabsContext();

  const allMilestones =
    (selectedEscrow?.milestones as MultiReleaseMilestone[]) || [];

  const getTotalAmount = () => {
    if (!selectedEscrow) return "0";

    if (activeEscrowType === "single-release") {
      const amount = selectedEscrow.amount;
      return amount != null && !isNaN(Number(amount)) ? String(amount) : "0";
    }

    const total = allMilestones.reduce((sum: number, milestone) => {
      const amount = milestone?.amount;
      return (
        sum + (amount != null && !isNaN(Number(amount)) ? Number(amount) : 0)
      );
    }, 0);
    return isNaN(total) ? "0" : String(total);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Landmark className="h-4 w-4 text-primary" />
        Financial Information
      </h3>

      <div className="grid gap-3 text-sm">
        <div className="flex items-start gap-3">
          <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Total Amount</p>
            <p className="text-muted-foreground text-xs">{getTotalAmount()}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <PiggyBank className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Balance</p>
            <p className="text-muted-foreground text-xs">
              {selectedEscrow?.balance != null &&
              !isNaN(Number(selectedEscrow.balance))
                ? String(selectedEscrow.balance)
                : "0"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Percent className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Platform Fee</p>
            <p className="text-muted-foreground text-xs">
              {selectedEscrow?.platformFee != null &&
              !isNaN(Number(selectedEscrow.platformFee))
                ? String(Number(selectedEscrow.platformFee))
                : "0"}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
