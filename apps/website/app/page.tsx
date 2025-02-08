'use client'

import { Stack, Typography } from "@mui/material";
import { useAccount } from "wagmi";
import ETFBuilder from "@/components/etfBuilder";

export default function Home() {
  const {isConnected} = useAccount();
  
  return (
    <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" mt={8}>
      {!isConnected && <Typography variant="h4" pt={8}>Connect your wallet</Typography>}
      {isConnected && <ETFBuilder />}
    </Stack>
  );
}
