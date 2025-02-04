import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Stack } from '@mui/material';
import { FaBloggerB } from "react-icons/fa";

import { ThemeSwitcherElement } from '../hooks/useThemeSwitcher';

const Header = () => {
  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Avatar alt="Brent" sx={{ width: 40, height: 40 }} >
          <FaBloggerB />
        </Avatar>
        {/* <Avatar alt="Brent" src="/icon.png" sx={{ width: 40, height: 40 }} /> */}
        {/* <Typography variant="h4" fontWeight={'bold'} color="inherit">B</Typography> */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end">
          <appkit-button balance={'hide'}/>
          <ThemeSwitcherElement />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;