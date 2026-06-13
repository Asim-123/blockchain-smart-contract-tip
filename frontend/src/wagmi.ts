import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";

const chainName = import.meta.env.VITE_CHAIN || "hardhat";
const chains = chainName === "sepolia" ? [sepolia] as const : [hardhat] as const;

export const wagmiConfig = getDefaultConfig({
  appName: "Tip Jar",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo-project-id",
  chains,
  ssr: false,
});

export const activeChain = chains[0];
