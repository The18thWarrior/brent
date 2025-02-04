import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeSwitcherProvider } from "@/hooks/useThemeSwitcher";
import Header from "./header";
import Wrapper from "./wrapper";
import React, { ReactNode } from 'react';
import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { Suspense } from "react";
import ContextProvider from "./context";

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const appkitMetadata = {
  name: 'Agent Brent',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
  defaultNetwork: mainnet,
  metadata: appkitMetadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  }
})


const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brent",
  description: "Crypto but faster",
  icons: '/favicon.ico'
};

export default function RootLayout({
  children,
  cookies
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <html lang="en">
      <body className={`${geistSans.variable}`}>
        <Suspense>
          <ContextProvider cookies={cookies}>
            <Wrapper>
              {children}
            </Wrapper>
          </ContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
