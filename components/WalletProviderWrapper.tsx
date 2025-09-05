import React, { useEffect, useState } from "react";
import { WalletSelectorProvider } from "@near-wallet-selector/react-hook";

import { useNetwork } from "@/contexts/NetworkContext";

interface WalletProviderWrapperProps {
  children: React.ReactNode;
}

export const WalletProviderWrapper: React.FC<WalletProviderWrapperProps> = ({
  children,
}) => {
  const { walletSelectorConfig, network } = useNetwork();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [network]);

  return (
    <WalletSelectorProvider key={key} config={walletSelectorConfig}>
      {children}
    </WalletSelectorProvider>
  );
};
