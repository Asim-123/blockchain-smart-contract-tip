import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "./wagmi";
import { TipForm, TipList, StatsBar, type Tip } from "./components";
import { useCallback, useState } from "react";

const queryClient = new QueryClient();

const rainbowTheme = darkTheme({
  accentColor: "#f5a623",
  accentColorForeground: "#1a1000",
  borderRadius: "medium",
  fontStack: "system",
});

function TipJarApp() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [tips, setTips] = useState<Tip[]>([]);

  const handleTipConfirmed = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleStatsChange = useCallback((newTips: Tip[]) => {
    setTips(newTips);
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">🫙</div>
          <div className="brand-text">
            <h1>Tip Jar</h1>
            <p>On-chain gratitude</p>
          </div>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </header>

      <section className="hero">
        <h2>
          Show appreciation, <em>on-chain</em>
        </h2>
        <p>
          Send ETH with a personal message. Every tip is recorded permanently on the blockchain
          and indexed in real time.
        </p>
      </section>

      <StatsBar tips={tips} />

      <div className="main-grid">
        <TipForm onTipConfirmed={handleTipConfirmed} />
        <TipList key={refreshKey} onStatsChange={handleStatsChange} />
      </div>

      <footer className="app-footer">
        Built with Solidity · wagmi · viem &nbsp;·&nbsp; <span>Tip Jar dApp</span>
      </footer>
    </>
  );
}

export function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme}>
          <TipJarApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
