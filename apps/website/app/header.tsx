'use client'
/// <reference path="../global.d.ts" />

import React from 'react';
import { AppBar, Toolbar, Avatar, Stack } from '@mui/material';
import { FaBloggerB } from "react-icons/fa";

import { ThemeSwitcherElement } from '../hooks/useThemeSwitcher';

const Header = () => {
  return (
    <AppBar position="fixed" color="primary" elevation={1} sx={{ zIndex: 10 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Avatar alt="Brent" sx={{ width: 40, height: 40 }} >
          <FaBloggerB />
        </Avatar>
        {/* <Avatar alt="Brent" src="/icon.png" sx={{ width: 40, height: 40 }} /> */}
        {/* <Typography variant="h4" fontWeight={'bold'} color="inherit">B</Typography> */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end">
          {/* @ts-expect-error msg */}
          <appkit-button balance={'hide'}/>
          <ThemeSwitcherElement />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;