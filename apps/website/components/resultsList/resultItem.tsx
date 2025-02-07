'use client'
import React, { useEffect } from 'react';
import { Avatar, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { SourceList, Token, Token2 } from '@/services/types';
import { queryPools } from '@/services/poolChecker';
import { formatEther } from 'viem'
import { useAccount } from 'wagmi';
import { Delete } from '@mui/icons-material';

const ResultItem = ({token, sourceToken, setFee}: {token: Token, sourceToken: Token, setFee: (address: string, fee: number) => void}) => {
  const [poolFee, setPoolFee] = React.useState(0);
  const [poolLiquidity, setPoolLiquidity] = React.useState(BigInt(0));
  const [hasPool, setHasPool] = React.useState(false);

  const setHasNoPool = () => {
    setHasPool(false);
    setPoolFee(0);
    setPoolLiquidity(BigInt(0));
  };

  const deletePool = () => {
    setHasNoPool();
    setFee(token.address, 0);
  }
  useEffect(() => {
    const fetchPools = async () => {
      const poolData = await queryPools({
        sourceToken: {...sourceToken, chainId: 137, symbol: sourceToken.name} as Token2,
        targetToken: {...token, chainId: 137, symbol: token.name} as Token2,
        chainId: 137,
      });
      if (poolData) {
        const _liquidity = BigInt(poolData.liquidity);
        if (_liquidity === BigInt(0)) {
          setHasNoPool();
        } else {
          setPoolFee(poolData.feeTier);
          setPoolLiquidity(_liquidity);
          setHasPool(true);
          setFee(token.address, poolData.feeTier);
          console.log('token w/ data', token, poolData);
        }
      } else {
        setHasNoPool();
      }
    };
    if (sourceToken && token) fetchPools();
  }, [token, sourceToken]);

  if (!hasPool) return null;
  return (
  <Tooltip title={`${token.description} | Pool Fee: ${poolFee/1000}%`} placement="top">
    <Box display="flex" justifyContent="center" alignItems="center" width={'100%'} >
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" width={'100%'}>
        <Avatar src={token.logo} sx={{ width: 24, height: 24 }} />
        <Typography color='text.primary'>{token.name}</Typography>
        <Typography color='text.primary'>{formatEther(poolLiquidity)}</Typography>        
        <IconButton onClick={deletePool}><Delete /></IconButton>
      </Stack>
    </Box>
  </Tooltip>
);
}
export default ResultItem;

