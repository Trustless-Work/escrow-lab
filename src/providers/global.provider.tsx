"use client";

import { ThemeProvider } from "@/providers/theme.provider";
import { EscrowProvider } from "./escrow.provider";
import { WalletProvider } from "./wallet.provider";
import { TabsProvider } from "./tabs.provider";
import { TrustlessWorkProvider } from "./trustless-work.provider";
import { DialogsProvider } from "./dialogs.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider>
        <TrustlessWorkProvider>
          <TabsProvider>
            <DialogsProvider>
              <EscrowProvider>{children}</EscrowProvider>
            </DialogsProvider>
          </TabsProvider>
        </TrustlessWorkProvider>
      </WalletProvider>
    </ThemeProvider>
  );
};
