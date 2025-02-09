'use client'

import { Stack, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import ETFBuilder from "@/components/etfBuilder";

export default function Home() {
  const {isConnected, chainId} = useAccount();
  
  return (
    <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" mt={8}>
      {!isConnected && <Typography variant="h4" pt={8}>Connect your wallet</Typography>}
      {isConnected && chainId !== 137 && <Typography variant="h4" pt={8}>Switch to Polygon Mainnet</Typography>}
      {isConnected && chainId === 137 && <ETFBuilder />}
    </Stack>
  );
}
