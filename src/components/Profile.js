import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Grid, Avatar, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';

const RootContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
}));

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && (
            <RootContainer>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={4}>
                        <ProfilePaper elevation={3}>
                            <ProfileAvatar alt={user.name} src={user.picture} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {user.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                {user.email}
                            </Typography>
                        </ProfilePaper>
                    </Grid>
                </Grid>
            </RootContainer>
        )
    );
};

export default Profile;
