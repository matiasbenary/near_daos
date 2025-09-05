import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { NetworkId, WalletSelectorParams } from "@near-wallet-selector/core";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupHotWallet } from "@near-wallet-selector/hot-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMeteorWalletApp } from "@near-wallet-selector/meteor-wallet-app";

export type Network = "testnet" | "mainnet";

interface NetworkContextType {
  network: Network;
  setNetwork: (network: Network) => void;
  walletSelectorConfig: WalletSelectorParams;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const [network, setNetwork] = useState<Network>("testnet");
  const [isInitialized, setIsInitialized] = useState(false);

  const getWalletSelectorConfig = (
    currentNetwork: Network,
  ): WalletSelectorParams => {
    return {
      network: {
        networkId: currentNetwork as NetworkId,
        nodeUrl:
          currentNetwork === "mainnet"
            ? "https://rpc.mainnet.fastnear.com"
            : "https://rpc.testnet.fastnear.com",
      },
      modules: [
        setupBitteWallet(),
        setupMeteorWallet(),
        setupMeteorWalletApp({ contractId: "" }),
        setupHotWallet(),
        setupLedger(),
      ],
    } as WalletSelectorParams;
  };

  const [walletSelectorConfig, setWalletSelectorConfig] =
    useState<WalletSelectorParams>(getWalletSelectorConfig(network));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("near-network");

    if (stored === "mainnet" || stored === "testnet") {
      setNetwork(stored);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    setWalletSelectorConfig(getWalletSelectorConfig(network));
    if (isInitialized && typeof window !== "undefined") {
      window.localStorage.setItem("near-network", network);
    }
  }, [network, isInitialized]);

  const value = {
    network,
    setNetwork,
    walletSelectorConfig,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }

  return context;
};
