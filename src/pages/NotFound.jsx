import React from 'react'
import { Box, Typography, Container } from '@mui/material';
import { ErrorOutlineOutlined } from '@mui/icons-material';

export const NotFound = () => {
  return (
    <Container>
      <Box>
        <ErrorOutlineOutlined style={{ fontSize: 96, color: 'gray' }} />
        <Typography variant="h4" align="center" style={{ marginTop: '2rem' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" align="center" style={{ marginTop: '1rem' }}>
          The page you are looking for does not exist.
        </Typography>
      </Box>
    </Container>
  );
}
