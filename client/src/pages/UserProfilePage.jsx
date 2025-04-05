import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    gender: '',
    dob: '',
    address: ''
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { updateProfileImage } = useAuth();


  useEffect(() => {
    axios.get('/api/profile', { withCredentials: true })
      .then(res => {
        const data = res.data;
        const formattedDob = data.dob ? data.dob.slice(0, 10) : '';
        setProfile({ ...data, dob: formattedDob });
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to load profile.');
        setOpen(true);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('/api/profile', profile, { withCredentials: true });
      setMessage(res.data.message || 'Profile updated!');
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
      try {
        const imageUrl = await uploadImage(file);
        setProfile(prev => ({ ...prev, profileImage: imageUrl }));
        updateProfileImage(imageUrl); //update the Avatar in Navbar
        setMessage("✅ Image uploaded successfully!");
        setOpen(true);
      } catch (err) {
        setMessage("❌ Image upload failed.");
        setOpen(true);
      }
    }
  };


  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Profile
      </Typography>

      <Grid container justifyContent="center" sx={{ mb: 2 }}>
        <Avatar
          alt="Profile Image"
          src={profile.profileImage}
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
            <TextField fullWidth type="date" name="dob" value={profile.dob} onChange={handleChange} label="Date of Birth" InputLabelProps={{ shrink: true }} />
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
