import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Box } from '@material-ui/core';

export default function CircularUnderLoad() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60vh"
    >
      <CircularProgress disableShrink />
    </Box>
  );
}
