'use client';

import CacheProvider from './package-components/CacheProvider';
import ChakraProvider from './package-components/ChakraProvider';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [mainnet, goerli, sepolia],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "PromptPayroll",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

import Header from './components/Header';
import Footer from './components/Footer';

export default function Layout({ children }) {

  return (
    <html lang="en">
      <head />
      <body style={{backgroundColor:"#1B262C", color:"#BBE1FA"}}>
        <CacheProvider>
          <ChakraProvider>
              <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider chains={chains} coolMode>
                <Header />
                  {children}
                <Footer />
              </RainbowKitProvider>
              </WagmiConfig>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
