"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MainTabs = "deploy" | "escrow" | "helper";
export type EscrowTabs =
  | "get-escrow"
  | "fund-escrow"
  | "change-milestone-status"
  | "approve-milestone"
  | "change-dispute-flag"
  | "start-dispute"
  | "resolve-dispute"
  | "withdraw"
  | "release-funds"
  | "update-escrow";
type EscrowType = "multi-release" | "single-release";

interface TabsContextType {
  // Main navigation tabs
  activeTab: MainTabs;
  setActiveTab: (tab: MainTabs) => void;

  // Escrow operation tabs
  activeEscrowTab: EscrowTabs;
  setActiveEscrowTab: (tab: EscrowTabs) => void;

  // Escrow type tabs
  activeEscrowType: EscrowType;
  setActiveEscrowType: (tab: EscrowType) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within TabsProvider");
  }
  return context;
}

export function TabsProvider({ children }: { children: ReactNode }) {
  // Main navigation state
  const [activeTab, setActiveTab] = useState<MainTabs>("deploy");

  // Escrow operations state
  const [activeEscrowTab, setActiveEscrowTab] =
    useState<EscrowTabs>("fund-escrow");

  // Escrow type state
  const [activeEscrowType, setActiveEscrowType] =
    useState<EscrowType>("multi-release");

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeEscrowTab,
        setActiveEscrowTab,
        activeEscrowType,
        setActiveEscrowType,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}
