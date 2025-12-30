"use client";

import Image from "next/image";
import { ThemeToggle } from "../utils/theme-toggle";
import { WalletButton } from "../tw-blocks/wallet-kit/WalletButtons";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Image
            src="/logo.png"
            alt="Trustless Work Logo"
            width={70}
            height={70}
          />
          <p className="text-xl font-bold hidden md:block">
            Trustless Work{" "}
            <span className="text-muted-foreground/80 text-base italic">
              Testnet Laboratory
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <WalletButton />
        </div>
      </div>
    </header>
  );
};
