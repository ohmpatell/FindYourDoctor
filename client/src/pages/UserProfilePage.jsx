import React, { useState } from 'react';
import {
  Container, Typography, Grid, TextField, Button, Avatar,
  Snackbar, Alert, CircularProgress, Box, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { uploadImage } from '../services/cloudinary';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserProfilePage = () => {
  const { auth, updateProfileImage } = useAuth();
  const user = auth.user;
  const role = user.role;

  const [profile, setProfile] = useState({
    ...user,
    address: user.address || { street: '', city: '', province: '' },
    operatingHours: user.operatingHours || {},
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || '');
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const key = name.split('.')[1];
      setProfile(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOperatingHoursChange = (day, timeType, value) => {
    setProfile(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: { ...prev.operatingHours?.[day], [timeType]: value }
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updated = { ...profile };
      if (image) {
        const url = await uploadImage(image);
        updated.profileImage = url;
        updateProfileImage(url);
      }
      const res = await api.put('/profile', updated, { withCredentials: true });
      setMessage(res.data.message || 'Profile updated!');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
      setOpen(true);
    }
  };

  const renderOperatingHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => (
      <Grid container spacing={1} key={day} sx={{ mb: 1 }}>
        <Grid item xs={4}>
          <Typography variant="body2">{day.charAt(0).toUpperCase() + day.slice(1)}</Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            size="small"
            fullWidth
            label="Open"
            value={profile.operatingHours?.[day]?.open || ''}
            onChange={e => handleOperatingHoursChange(day, 'open', e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            size="small"
            fullWidth
            label="Close"
            value={profile.operatingHours?.[day]?.close || ''}
            onChange={e => handleOperatingHoursChange(day, 'close', e.target.value)}
          />
        </Grid>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {role === 'CLINIC' ? 'Clinic Profile' : role === 'DOCTOR' ? 'Doctor Profile' : 'My Profile'}
      </Typography>

      <Grid container justifyContent="center" sx={{ mb: 2 }}>
        <Avatar alt="Profile" src={preview} sx={{ width: 130, height: 130 }} />
      </Grid>

      <Grid container justifyContent="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {role !== 'CLINIC' && (
            <>
              <Grid item xs={6}>
                <TextField fullWidth name="firstName" label="First Name" value={profile.firstName} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth name="lastName" label="Last Name" value={profile.lastName} onChange={handleChange} />
              </Grid>
            </>
          )}

          {role === 'CLINIC' && (
            <>
              <Grid item xs={12}>
                <TextField fullWidth name="name" label="Clinic Name" value={profile.name} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth name="phoneNumber" label="Phone Number" value={profile.phoneNumber || ''} onChange={handleChange} />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <TextField fullWidth name="email" label="Email" value={profile.email} disabled />
          </Grid>


          {role === 'DOCTOR' && (
            <>
              <Grid item xs={6}>
                <TextField fullWidth name="specialization" label="Specialization" value={profile.specialization || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth name="credentials" label="Credentials" value={profile.credentials || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="bio" label="Bio" multiline rows={3} value={profile.bio || ''} onChange={handleChange} />
              </Grid>
            </>
          )}

          {(role === 'CLINIC' || role === 'USER') && (
            <>
              <Grid item xs={4}>
                <TextField fullWidth name="address.street" label="Street" value={profile.address?.street || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth name="address.city" label="City" value={profile.address?.city || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth name="address.province" label="Province" value={profile.address?.province || ''} onChange={handleChange} />
              </Grid>
            </>
          )}

          {role === 'CLINIC' && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Operating Hours</Typography>
              {renderOperatingHours()}
            </Grid>
          )}

          {/* Gender / DOB - Only for User */}
          {role === 'USER' && (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select name="gender" value={profile.gender || ''} label="Gender" onChange={handleChange}>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="dob"
                  type="date"
                  value={profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : ''}
                  label="Date of Birth"
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" disabled={saving} startIcon={saving && <CircularProgress size={20} />}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity={message.includes('Failed') ? 'error' : 'success'}>{message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfilePage;
