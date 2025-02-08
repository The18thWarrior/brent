'use client'
import React, { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Avatar, Box, Button, ButtonBase, Divider, IconButton, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { SourceList, Token } from '@/services/types';
import ResultItem from './resultItem';
import { Refresh } from '@mui/icons-material';
import { BuyButton } from '../buyButton';
import { parseUnits } from 'viem';
import { polygonCoins, baseCoins } from '@brent/index-builder';

const sourceTokens: Token[] = [
  {
    name: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    description: "Tether USD (USDT) is a stablecoin pegged to the US Dollar.",
    decimals: 6,
    logo: "https://xucre-public.s3.sa-east-1.amazonaws.com/tether.png",
    category: 'stablecoin',
    risk: 'low',
  },
  {
    name: "USDC",
    address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    description: "USD Coin (USDC) is a stablecoin backed by US dollars.",
    decimals: 6,
    logo: "https://xucre-public.s3.sa-east-1.amazonaws.com/usdc.png",
    category: 'stablecoin',
    risk: 'low',
  }
];

const ResultsList = ({source, refresh}: {source: SourceList | null, refresh: () => void}) => {
  const [sourceToken, setSourceToken] = useState<Token>();
  const [amount, setAmount] = useState<number>(0);
  const [feeList, setFeeList] = useState<{[key: string]: number}>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFeeChange = (address: string, fee: number) => {{}
    setFeeList(prev => ({ ...prev, [address]: fee }));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setAmount(Number(event.target.value));
    } catch (error) {
      console.error("Invalid input: ", event.target.value);
    }
  }

  const coins = polygonCoins.reduce((acc, coin) => {
    acc[coin.address] = {...coin, category: coin.tags};
    return acc;
  }, {} as {[key: string]: Token});

  return (
    <Stack direction={'column'} spacing={2} >
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
        <ButtonBase aria-label="Change funding source." id="basic-button" onClick={handleClick} sx={{}}>
          <Stack direction={'row'} spacing={2} sx={{}}>
            {sourceToken && sourceToken.logo && <Avatar src={sourceToken.logo} sx={{ width: 24, height: 24 }} />}
            <Typography color='text.primary'>{sourceToken ? sourceToken.name: 'Select Source Token'}</Typography>
            <ArrowDropDownIcon />
          </Stack>
        </ButtonBase>
        <IconButton aria-label="refreh" onClick={refresh}>
          <Refresh />
        </IconButton>
      </Stack>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {sourceTokens.map((token) => (
          <MenuItem key={token.address} onClick={() => { setSourceToken(token); handleClose(); }}>
            <Stack direction={'row'} spacing={2}>
              <Avatar src={token.logo} sx={{ width: 24, height: 24 }} />
              <Typography color='text.primary'>{token.name || 'N/A'}</Typography>
            </Stack>

          </MenuItem>
        ))}
      </Menu>
      
      <Divider sx={{my:3}} />

      <Stack direction={'column'} spacing={2} justifyContent={'center'} alignItems={'center'}>
        {source && sourceToken && source.tokens.map((token, index) => {
          return (
            <ResultItem key={index} token={token} metadataMap={coins} sourceToken={sourceToken} setFee={handleFeeChange} />
          )
        })}
      </Stack>
      <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
        {sourceToken && Object.keys(feeList).length > 0 && source && 
          <TextField id="amount" label="Amount"type={'number'} value={amount} onChange={handleAmountChange} />
        }
        {sourceToken && Object.keys(feeList).length > 0 && source && 
          <BuyButton sourceToken={sourceToken}  tokenList={source.tokens} amount={parseUnits(amount.toString(), sourceToken.decimals)} fees={feeList} />
        }
      </Stack>
    </Stack>
  )
};

export default ResultsList;



