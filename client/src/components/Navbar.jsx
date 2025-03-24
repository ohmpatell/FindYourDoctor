// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState(null);
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

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

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  let navLinks = [{ label: 'Home', path: '/' }];
  if (auth.isAuthenticated) {
    if (auth.user.role === 'USER') {
      navLinks = [
        { label: 'Search Doctors', path: '/search' },
        { label: 'My Appointments', path: '/user/home' },
      ];
    } else if (auth.user.role === 'CLINIC') {
      navLinks = [
        { label: 'Dashboard', path: '/clinic/home' },
        { label: 'Manage Appointments', path: '/clinic/appointments' },
        { label: 'Register Doctor', path: '/clinic/register-doctor' },
      ];
    } else if (auth.user.role === 'DOCTOR') {
      navLinks = [
        { label: 'Dashboard', path: '/doctor/home' },
        { label: 'My Schedule', path: '/doctor/schedule' },
      ];
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Mobile hamburger menu */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo Image */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src="/logo.png" alt="FindYourDoctor" style={{ height: 40, filter: 'brightness(0) invert(1)', marginTop: 5 }} />
          </Link>
        </Box>

        {/* Desktop Navigation Links */}
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

        {/* User Avatar and Menu (visible when authenticated) */}
        {auth.isAuthenticated && (
          <IconButton onClick={handleUserMenuOpen} sx={{ ml: 2 }}>
            <Avatar
              alt={auth.user.firstName || 'User'}
              src={auth.user.profileImage || ''}
            />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu */}
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

      {/* User Menu */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
}
