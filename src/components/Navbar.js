// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated } = useAuth0();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <PetsIcon sx={{ marginRight: 1 }} />
            <Typography variant="h6" noWrap>
              My App
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
            <Button color="inherit" component={Link} to="/profile" sx={{ color: 'white', textDecoration: 'none' }}>
              Profile
            </Button>
            <Button color="inherit" component={Link} to="/pets" sx={{ color: 'white', textDecoration: 'none' }}>
              Pets
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/profile">
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button component={Link} to="/pets">
              <ListItemText primary="Pets" />
            </ListItem>
            <ListItem>
              {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
