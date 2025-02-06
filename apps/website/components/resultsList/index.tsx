'use client'
import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Avatar, Box, Button, ButtonBase, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { SourceList, Token } from '@/services/types';

const sourceTokens: Token[] = [
  {
    name: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    logo: "https://xucre-public.s3.sa-east-1.amazonaws.com/tether.png",
    category: 'stablecoin',
    risk: 'low',
  },
  {
    name: "USDC",
    address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    decimals: 6,
    logo: "https://xucre-public.s3.sa-east-1.amazonaws.com/usdc.png",
    category: 'stablecoin',
    risk: 'low',
  }
];

const ResultsList = ({source}: {source: SourceList | null}) => {
  const [sourceToken, setSourceToken] = useState<Token>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" >
      <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'start'}>
        <ButtonBase aria-label="Change funding source." id="basic-button" onClick={handleClick} sx={{}}>
          <Stack direction={'row'} spacing={2} sx={{}}>
            {sourceToken && sourceToken.logo && <Avatar src={sourceToken.logo} sx={{ width: 24, height: 24 }} />}
            <Typography color='text.primary'>{sourceToken ? sourceToken.name: 'Select Source Token'}</Typography>
            <ArrowDropDownIcon />
          </Stack>
        </ButtonBase>
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

      <Stack direction={'column'} spacing={2} justifyContent={'center'} alignItems={'center'}>
        {source && source.tokens.map((token) => {
          return (
            <Stack key={token.address} direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
              <Avatar src={token.logo} sx={{ width: 24, height: 24 }} />
              <Typography color='text.primary'>{token.name}</Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  )
};

export default ResultsList;



