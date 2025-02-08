import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Wrapper from "./wrapper";
import React from 'react';
import { wagmiAdapter, projectId } from '@/config'
import { createAppKit } from '@reown/appkit/react' 
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks'
import { Suspense } from "react";
import { headers } from 'next/headers' // added
import ContextProvider from "./context";

// Set up queryClient

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
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
  defaultNetwork: mainnet,
  metadata: appkitMetadata,
  themeVariables: {
    '--w3m-accent': '#084D3E',
    '--w3m-color-mix': '#084D3E',
    '--w3m-color-mix-strength': 40
  },
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

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
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
