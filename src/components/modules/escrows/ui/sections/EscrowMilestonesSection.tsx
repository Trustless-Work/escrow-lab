import { Badge } from "@/components/ui/badge";
import {
  SingleReleaseMilestone,
  MultiReleaseMilestone,
  GetEscrowsFromIndexerResponse as Escrow,
} from "@trustless-work/escrow/types";
import { AlertCircle, CheckCircle2, Handshake, User } from "lucide-react";
import { useTabsContext } from "@/providers/tabs.provider";
import { EntityCard } from "../cards/EntityCard";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/components/tw-blocks/helpers/format.helper";

interface EscrowMilestonesSectionProps {
  selectedEscrow: Escrow | null;
}

export const EscrowMilestonesSection = ({
  selectedEscrow,
}: EscrowMilestonesSectionProps) => {
  const { activeEscrowType } = useTabsContext();

  return (
    <div className="space-y-4">
      {selectedEscrow?.milestones.map(
        (
          milestone: SingleReleaseMilestone | MultiReleaseMilestone,
          index: number
        ) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
          >
            {/* Header with milestone info */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">
                      Milestone {index + 1}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  {activeEscrowType === "multi-release" && (
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(
                          (milestone as MultiReleaseMilestone).amount,
                          selectedEscrow?.trustline.symbol
                        )}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {activeEscrowType === "multi-release" && (
              <>
                <Separator className="my-4" />

                <EntityCard
                  name="Receiver"
                  entity={(milestone as MultiReleaseMilestone).receiver || ""}
                  icon={<User size={20} />}
                  className="mb-4"
                />
              </>
            )}

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {milestone.status && (
                <Badge
                  variant={
                    milestone.status === "approved" ? "default" : "secondary"
                  }
                  className={cn(
                    "uppercase",
                    milestone.status === "approved"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50"
                      : ""
                  )}
                >
                  {milestone.status === "approved" ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </>
                  ) : (
                    milestone.status
                  )}
                </Badge>
              )}

              {activeEscrowType === "single-release" ? (
                // Single Release - Only show approved flag
                (milestone as SingleReleaseMilestone).approved && (
                  <Badge
                    variant="secondary"
                    className="text-green-700 dark:text-green-300 uppercase"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                )
              ) : (
                // Multi Release - Show all flags
                <>
                  {(milestone as MultiReleaseMilestone).flags?.approved && (
                    <Badge
                      variant="secondary"
                      className="text-green-700 dark:text-green-300 uppercase"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                  {(milestone as MultiReleaseMilestone).flags?.disputed && (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Disputed
                    </Badge>
                  )}
                  {(milestone as MultiReleaseMilestone).flags?.released && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 uppercase"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Released
                    </Badge>
                  )}
                  {(milestone as MultiReleaseMilestone).flags?.resolved && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 uppercase"
                    >
                      <Handshake className="w-3 h-3 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Evidence section */}
            {milestone.evidence && (
              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground break-words overflow-hidden">
                  <span className="font-medium text-foreground">Evidence:</span>{" "}
                  {milestone.evidence}
                </p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};
