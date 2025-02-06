'use client'

import Header from './header';
import { Box, CssBaseline, Stack } from '@mui/material';
import { ThemeSwitcherProvider } from '@/hooks/useThemeSwitcher';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

export default function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideMenu = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/verify-email' || pathname === '/privacy' || pathname === '/onboarding'
  
  return (
    <Box>
      <ThemeSwitcherProvider>
        <CssBaseline enableColorScheme />
        <Stack direction={'column'} justifyContent={'space-between'} minHeight={'100dvh'}>
          <Stack direction={'column'} justifyContent={'flex-start'} spacing={4}>
            <Header />
            <Stack direction={'column'} justifyContent={'start'}>
              <Stack spacing={2} direction="row" width={'full'} alignItems={'top'}>
                <Box flexGrow={1}>
                  {children}
                </Box>
              </Stack>              
            </Stack>
          </Stack>
        </Stack>
      </ThemeSwitcherProvider>
    </Box>
  );
}

