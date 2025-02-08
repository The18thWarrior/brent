'use client'

import { styled } from "@mui/material";


export default styled('textarea')(({ theme }) => ({
  width: '100%',
  minHeight: '150px',
  padding: '8px',
  paddingRight: '40px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  resize: 'vertical',
  color: theme.palette.mode === 'dark' ? 'white' : 'black',
  backgroundColor: theme.palette.mode === 'dark' ? 'dimgray' : 'lightgray',
  '&::placeholder': {
    color: theme.palette.text.disabled,
  },
}));