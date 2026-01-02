import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";
import { DollarSign, Landmark, Percent, PiggyBank } from "lucide-react";

interface FinancialDetailsSectionProps {
  balance: number;
  totalAmount: number;
  currency: string;
  platformFee: number;
}

export const FinancialDetailsSection = ({
  balance,
  totalAmount,
  currency,
  platformFee,
}: FinancialDetailsSectionProps) => {
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
            <p className="text-muted-foreground text-xs">
              {formatCurrency(totalAmount, currency)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <PiggyBank className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Balance</p>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(balance, currency)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Percent className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">Platform Fee</p>
            <p className="text-muted-foreground text-xs">{platformFee}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
