import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMeteorWalletApp } from "@near-wallet-selector/meteor-wallet-app";
import { WalletSelectorProvider } from "@near-wallet-selector/react-hook";
import "@near-wallet-selector/modal-ui/styles.css";
import { NetworkId, WalletModuleFactory } from "@near-wallet-selector/core";

import { fontSans, fontMono } from "@/config/fonts";

const CONTRACT_ID = "sputnikv2.testnet";

const walletSelectorConfig = {
  network: "testnet" as NetworkId,
  createAccessKeyFor: {
    contractId: CONTRACT_ID,
    methodNames: [],
  },
  modules: [
    setupBitteWallet(),
    setupMeteorWallet(),
    setupMeteorWalletApp({ contractId: CONTRACT_ID }),
  ] as WalletModuleFactory[],
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <WalletSelectorProvider config={walletSelectorConfig}>
          <Component {...pageProps} />
        </WalletSelectorProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
