'use client'
import React from 'react';
import Tetris from 'react-tetris'
import './loadingComponent.css'
import { Box, Button, Stack } from '@mui/material';

const LoadingComponent = () => (
  <Box display="flex" justifyContent="center" alignItems="center" >
    <Tetris
      keyboardControls={{
        // Default values shown here. These will be used if no
        // `keyboardControls` prop is provided.
        down: 'MOVE_DOWN',
        left: 'MOVE_LEFT',
        right: 'MOVE_RIGHT',
        space: 'HARD_DROP',
        z: 'FLIP_COUNTERCLOCKWISE',
        x: 'FLIP_CLOCKWISE',
        up: 'FLIP_CLOCKWISE',
        p: 'TOGGLE_PAUSE',
        c: 'HOLD',
        shift: 'HOLD'
      }}
    >
      {({
        HeldPiece,
        Gameboard,
        PieceQueue,
        points,
        linesCleared,
        state,
        controller
      }) => (
        <Stack direction="row" spacing={0}>
          <Box minWidth={175}>
            <HeldPiece />
            <Box>
              <p>Points: {points}</p>
              <p>Lines Cleared: {linesCleared}</p>
            </Box>
          </Box>
          <Box minWidth={300}>
            <Gameboard />
          </Box>
          <Box minWidth={200}>
            <PieceQueue />
          </Box>

          {state === 'LOST' && (
              <Box minWidth={200} display={'block'}>
                <h2>Game Over</h2>
                <Button variant={'contained'} onClick={controller.restart}>New game</Button>
              </Box>
            )}
        </Stack>
      )}
    </Tetris>
  </Box>
);

export default LoadingComponent;