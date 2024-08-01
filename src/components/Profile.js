import React from 'react';
import { Container, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Page
      </Typography>
      <Typography variant="body1">
        This is the Profile page.
      </Typography>
    </Container>
  );
};

export default Profile;