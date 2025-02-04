import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';
import { ThemeSwitcherElement } from '../hooks/useThemeSwitcher';

const Header = () => {
  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Avatar alt="Brent" src="/icon.png" sx={{ width: 40, height: 40 }} />
        <Box>
          <ThemeSwitcherElement />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;