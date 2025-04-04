import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);

  // Handle mobile menu toggle
  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  // Handle user menu toggle
  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/');
  };

  // Define nav links based on role
  let navLinks = [{ label: 'Home', path: '/' }];
  if (auth.isAuthenticated) {
    if (auth.user.role === 'USER') {
      navLinks = [
        { label: 'Home', path: '/user/home' },
        { label: 'Search Doctors', path: '/search' },
        { label: 'My Appointments', path: '/my-appointments' },
      ];
    } else if (auth.user.role === 'CLINIC') {
      navLinks = [
        { label: 'Home', path: '/clinic/home' },
        { label: 'Manage Appointments', path: '/my-appointments' },
        { label: 'Register Doctor', path: '/clinic/register-doctor' },
      ];
    } else if (auth.user.role === 'DOCTOR') {
      navLinks = [
        { label: 'Home', path: '/doctor/home' },
        { label: 'Manage Appointments', path: '/my-appointments' },
        { label: 'My Schedule', path: '/doctor/schedule' },
      ];
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left: Logo + Clinic Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Link to="/">
            <img
              src="/logo.png"
              alt="FindYourDoctor"
              style={{ height: 40, filter: 'brightness(0) invert(1)', marginTop: 5 }}
            />
          </Link>

          {auth.isAuthenticated && auth.user.role === 'CLINIC' && (
            <Typography variant="h6" sx={{ ml: 2 }}>
              {auth.user.name}
            </Typography>
          )}
        </Box>

        {/* Desktop nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              color="inherit"
              component={Link}
              to={link.path}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        {/* User Avatar */}
        {auth.isAuthenticated && (
          <IconButton onClick={handleUserMenuOpen} sx={{ ml: 2 }}>
            <Avatar
              alt={auth.user.name || 'User'}
              src={auth.user.profileImage || ''}
            />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile menu dropdown */}
      <Menu
        anchorEl={mobileAnchorEl}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileMenuClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {navLinks.map((link) => (
          <MenuItem
            key={link.label}
            component={Link}
            to={link.path}
            onClick={handleMobileMenuClose}
          >
            {link.label}
          </MenuItem>
        ))}
        {auth.isAuthenticated && (
          <MenuItem onClick={() => { handleMobileMenuClose(); handleLogout(); }}>
            Logout
          </MenuItem>
        )}
      </Menu>

      {/* Avatar menu (top-right) */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
}
