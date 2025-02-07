'use client'
import React, { useEffect } from 'react';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { SourceList, Token, Token2 } from '@/services/types';
import { queryPools } from '@/services/poolChecker';

const ResultItem = ({token, sourceToken, setFee}: {token: Token, sourceToken: Token, setFee: (address: string, fee: number) => void}) => {
  const [poolFee, setPoolFee] = React.useState(0);
  const [poolLiquidity, setPoolLiquidity] = React.useState(0);
  const [hasPool, setHasPool] = React.useState(false);
  useEffect(() => {
    const fetchPools = async () => {
      const poolData = await queryPools({
        sourceToken: {...sourceToken, chainId: 137, symbol: sourceToken.name} as Token2,
        targetToken: {...token, chainId: 137, symbol: token.name} as Token2,
        chainId: 137,
      });
      if (poolData) {
        setPoolFee(poolData.feeTier);
        setPoolLiquidity(Number(poolData.liquidity));
        setHasPool(true);
        setFee(token.address, poolData.feeTier);
        console.log('token w/ data', token, poolData);
      } else {
        setHasPool(false);
        setPoolFee(0);
        setPoolLiquidity(0);
      }
    };
    if (sourceToken && token) fetchPools();
    fetchPools();
  }, [token, sourceToken]);

  if (!hasPool) return null;
  return (
  <Box display="flex" justifyContent="center" alignItems="center" >
    <Stack direction="row" spacing={2}>
      <Avatar src={token.logo} sx={{ width: 24, height: 24 }} />
      <Typography color='text.primary'>{token.name}</Typography>
    </Stack>
  </Box>
);
}
export default ResultItem;

