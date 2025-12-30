"use client";

import { motion } from "framer-motion";
import { useTabsContext } from "@/providers/tabs.provider";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";

const tabs = [
  { id: "multi-release", label: "Multi Release Escrow" },
  { id: "single-release", label: "Single Release Escrow" },
];

export const EscrowTypeTabs = () => {
  const { activeEscrowType, setActiveEscrowType } = useTabsContext();
  const { selectedEscrow } = useEscrowContext();

  const disabled = !!selectedEscrow;

  return (
    <div className="w-full">
      <div className="mx-auto">
        <div className="relative flex justify-evenly border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (!disabled) {
                  setActiveEscrowType(
                    tab.id as "single-release" | "multi-release"
                  );
                }
              }}
              disabled={disabled}
              className={`
                relative flex-1 px-6 py-4 text-sm font-bold tracking-wide transition-colors duration-150
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${
                  activeEscrowType !== tab.id &&
                  "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.label}
            </button>
          ))}

          {/* Clean sliding indicator */}
          <motion.div
            className={`absolute bottom-0 h-0.5 bg-primary ${
              disabled ? "opacity-50 bg-primary/50" : ""
            }`}
            layoutId="indicator"
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              left: `${
                tabs.findIndex((tab) => tab.id === activeEscrowType) *
                (100 / tabs.length)
              }%`,
              width: `${100 / tabs.length}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
