import { DisputeEscrowForm } from "../modules/escrows/ui/forms/single-release/DisputeEscrow";
import { FundEscrowForm } from "../modules/escrows/ui/forms/FundEscrowForm";
import { ChangeMilestoneStatusForm } from "../modules/escrows/ui/forms/ChangeMilestoneStatusForm";
import { ApproveMilestoneForm } from "../modules/escrows/ui/forms/ApproveMilestoneForm";
import { ReleaseFundsEscrowForm } from "../modules/escrows/ui/forms/single-release/ReleaseFundsEscrowForm";
import { ResolveDisputeEscrowForm } from "../modules/escrows/ui/forms/single-release/ResolveDisputeEscrowForm";
import { ResolveDisputeMilestoneForm } from "../modules/escrows/ui/forms/multi-release/ResolveDisputeMilestoneForm";
import { UpdateSingleEscrowForm } from "../modules/escrows/ui/forms/single-release/UpdateSingleEscrowForm";
import { EscrowCreatedSection } from "../modules/escrows/ui/sections/EscrowCreatedSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EscrowTabs as EscrowTabsType,
  useTabsContext,
} from "@/providers/tabs.provider";
import { DisputeMilestoneForm } from "../modules/escrows/ui/forms/multi-release/DisputeMilestoneForm";
import { ReleaseFundsMilestoneForm } from "../modules/escrows/ui/forms/multi-release/ReleaseFundsMilestoneForm";
import { UpdateMultiEscrowForm } from "../modules/escrows/ui/forms/multi-release/UpdateMultiEscrowForm";
import { WithdrawFundsForm } from "../modules/escrows/ui/forms/multi-release/WithdrawFundsForm";

export const EscrowTabs = () => {
  const { activeEscrowTab, activeEscrowType, setActiveEscrowTab } =
    useTabsContext();

  const tabOptions = [
    {
      value: "fund-escrow",
      label: "Fund Escrow",
    },
    {
      value: "change-milestone-status",
      label: "Change Status",
    },
    {
      value: "approve-milestone",
      label: "Approve Milestone",
    },
    {
      value: "start-dispute",
      label: activeEscrowType === "single-release" ? "Dispute" : "Dispute",
    },
    {
      value: "resolve-dispute",
      label:
        activeEscrowType === "single-release"
          ? "Resolve Dispute"
          : "Resolve Dispute",
    },
    {
      value: "release-funds",
      label:
        activeEscrowType === "single-release"
          ? "Release Funds"
          : "Release Funds",
    },
    {
      value: "update-escrow",
      label: "Update",
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Select - visible on mobile, hidden on desktop */}
      <div className="block md:hidden mb-4">
        <Select
          value={activeEscrowTab}
          onValueChange={(val) => setActiveEscrowTab(val as EscrowTabsType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {tabOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs - hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <Tabs
          value={activeEscrowTab}
          onValueChange={(val) => setActiveEscrowTab(val as EscrowTabsType)}
          className="w-full"
        >
          <TabsList className="w-full flex flex-wrap mb-32 md:mb-4 gap-1">
            <TabsTrigger value="fund-escrow" className="flex-1">
              Fund Escrow
            </TabsTrigger>
            <TabsTrigger value="change-milestone-status" className="flex-1">
              Change Status
            </TabsTrigger>
            <TabsTrigger value="approve-milestone" className="flex-1">
              Approve
            </TabsTrigger>
            <TabsTrigger value="start-dispute" className="flex-1">
              {activeEscrowType === "single-release" ? "Dispute" : "Dispute"}
            </TabsTrigger>
            <TabsTrigger value="resolve-dispute" className="flex-1">
              {activeEscrowType === "single-release"
                ? "Resolve Dispute"
                : "Resolve Dispute"}
            </TabsTrigger>
            {activeEscrowType === "multi-release" && (
              <TabsTrigger value="withdraw" className="flex-1">
                Withdraw
              </TabsTrigger>
            )}
            <TabsTrigger value="release-funds" className="flex-1">
              {activeEscrowType === "single-release"
                ? "Release Funds"
                : "Release Funds"}
            </TabsTrigger>
            <TabsTrigger value="update-escrow" className="flex-1">
              Update
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content - shared between mobile and desktop */}
      <div className="flex flex-col md:flex-row gap-10 w-full">
        <div className="w-full md:w-3/4">
          <div className="mt-2 pt-4 border-t">
            {activeEscrowTab === "fund-escrow" && <FundEscrowForm />}
            {activeEscrowTab === "change-milestone-status" && (
              <ChangeMilestoneStatusForm />
            )}
            {activeEscrowTab === "approve-milestone" && (
              <ApproveMilestoneForm />
            )}
            {activeEscrowTab === "start-dispute" &&
              (activeEscrowType === "single-release" ? (
                <DisputeEscrowForm />
              ) : (
                <DisputeMilestoneForm />
              ))}
            {activeEscrowTab === "resolve-dispute" &&
              (activeEscrowType === "single-release" ? (
                <ResolveDisputeEscrowForm />
              ) : (
                <ResolveDisputeMilestoneForm />
              ))}
            {activeEscrowTab === "withdraw" &&
              activeEscrowType === "multi-release" && <WithdrawFundsForm />}
            {activeEscrowTab === "release-funds" &&
              (activeEscrowType === "single-release" ? (
                <ReleaseFundsEscrowForm />
              ) : (
                <ReleaseFundsMilestoneForm />
              ))}
            {activeEscrowTab === "update-escrow" &&
              (activeEscrowType === "single-release" ? (
                <UpdateSingleEscrowForm />
              ) : (
                <UpdateMultiEscrowForm />
              ))}
          </div>
        </div>

        <EscrowCreatedSection />
      </div>
    </div>
  );
};
