'use client';

import './globals.css';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'Prompt Payroll',
  description: 'No more payday loans - liquidity when you need it!',
}

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CacheProvider>
          <ChakraProvider>
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider chains={chains}>
                <Header />
                  {children}
                <Footer />
              </RainbowKitProvider>
            </WagmiConfig>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
