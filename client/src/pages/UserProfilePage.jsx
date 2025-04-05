import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { uploadImage } from '../services/cloudinary';
import { useAuth } from '../contexts/AuthContext';


const UserProfilePage = () => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { updateProfileImage } = useAuth();
  const { auth } = useAuth();
  const user = auth.user;
  const [profile, setProfile] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    gender: user.gender,
    dob: user.dob,
    address: user.address,
  });
  const [pfp, setPfp] = useState(user.profileImage || '');
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updatedProfile = { ...profile };
      if (image) {
        const uploadResult = await uploadImage(image);
        updatedProfile = { ...updatedProfile, profileImage: uploadResult };
      }

      const res = await api.put('/profile', updatedProfile, { withCredentials: true });
      setMessage(res.data.message || 'Profile updated!');
      updateProfileImage(updatedProfile.profileImage);
    } catch (err) {
      setMessage("Update failed.");
    } finally {
      setSaving(false);
      setOpen(true);
    }
  };

  const handleRemoveImage = () => {
    setProfile(prev => ({ ...prev, profileImage: '' }));
    setMessage('✅ Profile image removed.');
    setOpen(true);
  };  
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file) {
        setPfp(URL.createObjectURL(file));
        setImage(file);
      }
    }
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Profile
      </Typography>

      <Grid container justifyContent="center" sx={{ mb: 2 }}>
        <Avatar
          alt="Profile Image"
          src={pfp}
          sx={{ width: 150, height: 150 }}
        />
      </Grid>

      <Grid container justifyContent="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button variant="outlined" component="label">
            Upload New Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="error" onClick={handleRemoveImage}>
            Remove Image
          </Button>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" name="email" value={profile.email} disabled />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Address" name="address" value={profile.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select name="gender" value={profile.gender || ''} label="Gender" onChange={handleChange}>
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              name="dob"
              value={profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              label="Date of Birth"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={saving}
              startIcon={saving && <CircularProgress size={20} color="inherit" />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>

          </Grid>
        </Grid>
      </form>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity={message.includes('failed') ? 'error' : 'success'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfilePage;
