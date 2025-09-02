import type { AppProps } from "next/app";

import "@/styles/globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupHotWallet } from "@near-wallet-selector/hot-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { WalletSelectorProvider } from "@near-wallet-selector/react-hook";
import "@near-wallet-selector/modal-ui/styles.css";
import { NetworkId, WalletModuleFactory } from "@near-wallet-selector/core";

import { Navbar } from "@/components/navbar";

const walletSelectorConfig = {
  network: "testnet" as NetworkId,
  modules: [
    setupBitteWallet(),
    setupHotWallet(),
    setupLedger(),
  ] as WalletModuleFactory[],
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletSelectorProvider config={walletSelectorConfig}>
      <Navbar />
      <Component {...pageProps} />
    </WalletSelectorProvider>
  );
}
