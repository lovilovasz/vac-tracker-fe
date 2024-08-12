// src/components/Loading.js
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
