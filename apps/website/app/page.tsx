'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Stack, Typography, useTheme } from "@mui/material";
import { useAccount } from "wagmi";
import { useState } from "react";
import ETFBuilder from "@/components/etfBuilder";

export default function Home() {
  const theme = useTheme();
  const {isConnected, address} = useAccount();
  const [loading, isLoading] = useState(false);
  
  return (
    <Stack direction="column" spacing={2} justifyContent="center" alignItems="center" mt={8}>
      {!isConnected && <Typography variant="h4" pt={8}>Connect your wallet</Typography>}
      {isConnected && <ETFBuilder />}
    </Stack>
  );
}
