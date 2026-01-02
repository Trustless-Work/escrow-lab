import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { AlertCircle, Milestone as MilestoneIcon, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EntityCard } from "../cards/EntityCard";
import { EscrowDetailsSection } from "./EscrowDetailsSection";
import { FinancialDetailsSection } from "./FinancialDetailsSection";
import { EscrowMilestonesSection } from "./EscrowMilestonesSection";
import { HeaderSection } from "./HeaderSection";
import {
  MultiReleaseMilestone,
  SingleReleaseEscrow,
} from "@trustless-work/escrow/types";
import { useTabsContext } from "@/providers/tabs.provider";
import { BalanceProgressDonut } from "@/components/tw-blocks/escrows/indicators/balance-progress/donut/BalanceProgress";

export const EscrowCreatedSection = () => {
  const { selectedEscrow } = useEscrowContext();
  const { activeEscrowType } = useTabsContext();

  const allMilestones =
    (selectedEscrow?.milestones as MultiReleaseMilestone[]) || [];

  const getTotalAmount = () => {
    if (activeEscrowType === "single-release") {
      return selectedEscrow?.amount;
    }

    const total = allMilestones.reduce((sum: number, milestone) => {
      const amount = milestone?.amount;
      return (
        sum + (amount != null && !isNaN(Number(amount)) ? Number(amount) : 0)
      );
    }, 0);

    return isNaN(total) ? "0" : String(total);
  };

  const totalMilestones = selectedEscrow?.milestones.length || 0;
  const completedMilestones =
    activeEscrowType === "multi-release"
      ? (selectedEscrow?.milestones as MultiReleaseMilestone[]).filter((m) => {
          const multiMilestone = m as MultiReleaseMilestone;
          return (
            multiMilestone.flags?.released || multiMilestone.flags?.resolved
          );
        }).length || 0
      : 0;
  const progressPercentage =
    totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return selectedEscrow ? (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader className="pb-2">
          <HeaderSection selectedEscrow={selectedEscrow} />
        </CardHeader>

        <CardContent>
          {activeEscrowType === "multi-release" && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="font-medium">Escrow Progress</span>
                <span className="text-muted-foreground">
                  {completedMilestones} of {totalMilestones} Milestones
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-10 gap-10">
            <div className="md:col-span-6">
              <EscrowDetailsSection selectedEscrow={selectedEscrow} />
            </div>

            <div className="md:col-span-4">
              <FinancialDetailsSection
                balance={selectedEscrow?.balance || 0}
                totalAmount={Number(getTotalAmount())}
                currency={selectedEscrow?.trustline.symbol}
                platformFee={Number(selectedEscrow?.platformFee || 0)}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <BalanceProgressDonut
            balance={selectedEscrow?.balance || 0}
            target={Number(getTotalAmount())}
            currency={selectedEscrow?.trustline.symbol}
          />

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EntityCard
              name="Service Provider"
              entity={selectedEscrow?.roles.serviceProvider || ""}
              icon={<User size={20} />}
            />

            <EntityCard
              name="Approver"
              entity={selectedEscrow?.roles.approver || ""}
              icon={<User size={20} />}
            />

            {selectedEscrow.type === "single-release" && (
              <EntityCard
                name="Receiver"
                entity={
                  (selectedEscrow as SingleReleaseEscrow)?.roles?.receiver || ""
                }
                icon={<User size={20} />}
              />
            )}

            <EntityCard
              name="Platform"
              entity={selectedEscrow?.roles.platformAddress || ""}
              icon={<User size={20} />}
            />

            <EntityCard
              name="Dispute Resolver"
              entity={selectedEscrow?.roles.disputeResolver || ""}
              icon={<User size={20} />}
            />

            <EntityCard
              name="Release Signer"
              entity={selectedEscrow?.roles.releaseSigner || ""}
              icon={<User size={20} />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MilestoneIcon className="h-5 w-5 text-primary" />
            <CardTitle>Milestones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <EscrowMilestonesSection selectedEscrow={selectedEscrow} />
        </CardContent>
      </Card>
    </div>
  ) : (
    <Card className="w-full max-w-4xl mx-auto shadow-sm border-l-4 border-l-muted">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Escrow Available</h3>
        <p className="text-muted-foreground max-w-md">
          There is no escrow data to display at the moment. Please create a new
          escrow.
        </p>
      </CardContent>
    </Card>
  );
};
