import type { AppProps } from "next/app";

import "@/styles/globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "@near-wallet-selector/modal-ui/styles.css";

import { Navbar } from "@/components/navbar";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { WalletProviderWrapper } from "@/components/WalletProviderWrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NetworkProvider>
      <WalletProviderWrapper>
        <Navbar />
        <Component {...pageProps} />
      </WalletProviderWrapper>
    </NetworkProvider>
  );
}
