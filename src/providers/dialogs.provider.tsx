"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DialogsContextType {
  loadEscrowDialogOpen: boolean;
  setLoadEscrowDialogOpen: (open: boolean) => void;
}

const DialogsContext = createContext<DialogsContextType | undefined>(undefined);

export function useDialogsContext() {
  const context = useContext(DialogsContext);
  if (!context) {
    throw new Error("useDialogsContext must be used within DialogsProvider");
  }
  return context;
}

export function DialogsProvider({ children }: { children: ReactNode }) {
  // Load escrow dialog state
  const [loadEscrowDialogOpen, setLoadEscrowDialogOpen] = useState(false);

  return (
    <DialogsContext.Provider
      value={{
        loadEscrowDialogOpen,
        setLoadEscrowDialogOpen,
      }}
    >
      {children}
    </DialogsContext.Provider>
  );
}
