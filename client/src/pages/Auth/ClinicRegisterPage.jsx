import React, { useState, useRef } from 'react';
import {
  Container,
  CssBaseline,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../../services/cloudinary';

const steps = ['Basic Info', 'Other Info', 'Privacy'];

function ClinicRegisterPage() {
  const navigate = useNavigate();
  const { registerClinic } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [logo, setLogo] = useState(null);
  const [uploadLogo, setUploadLogo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    street: '',
    city: '',
    province: '',
    profileImage: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setLogo(URL.createObjectURL(file));
      setUploadLogo(file);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep = () => {
    const newErrors = {};
    if(activeStep === 0) {
      if(!formData.name.trim()) newErrors.name = 'Clinic Name is required';
    }
    if(activeStep === 1) {
      if(!formData.email.trim()) newErrors.email = 'Required';
      if(!formData.password.trim()) newErrors.password = 'Required';
      if(!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Required';
      if(!formData.street.trim()) newErrors.street = 'Required';
      if(!formData.city.trim()) newErrors.city = 'Required';
      if(!formData.province.trim()) newErrors.province = 'Required';
      if(!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    }
    if(activeStep === 2) {
      if(!termsAccepted) newErrors.terms = 'You must accept the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if(!validateStep()) return;
    if(activeStep === steps.length - 1) {

      let updatedFormData = { ...formData };
      if(uploadLogo) {
        const uploadResult = await uploadImage(uploadLogo);
        updatedFormData = { ...formData, profileImage: uploadResult };
      }
      try {
        await registerClinic(
          updatedFormData.name,
          updatedFormData.email,
          updatedFormData.password,
          updatedFormData.phoneNumber,
          updatedFormData.street,
          updatedFormData.city,
          updatedFormData.province,
          updatedFormData.profileImage
        );
        navigate('/clinic/home');
      } catch(err) {
        console.error(err);
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper variant="outlined" sx={{ mt: 4, p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Clinic Registration!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Register your clinic to connect with patients and manage appointments.
          </Typography>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
          {activeStep === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
                <Avatar
                  src={logo}
                  sx={{ width: 120, height: 120, cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                >
                  {!logo && 'Upload'}
                </Avatar>
                <IconButton
                  sx={{ position: 'absolute', bottom: 0, right: 'calc(50% - 20px)' }}
                  onClick={handleAvatarClick}
                >
                  <EditIcon />
                </IconButton>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
              </Box>
              <TextField
                label="Clinic Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </>
          )}
          {activeStep === 1 && (
            <>
              <TextField
                label="Email Address"
                name="email"
                fullWidth
                required
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                required
                margin="normal"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
              />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <TextField
                    label="Street"
                    name="street"
                    fullWidth
                    required
                    value={formData.street}
                    onChange={handleChange}
                    error={Boolean(errors.street)}
                    helperText={errors.street}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="City"
                    name="city"
                    fullWidth
                    required
                    value={formData.city}
                    onChange={handleChange}
                    error={Boolean(errors.city)}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Province"
                    name="province"
                    fullWidth
                    required
                    value={formData.province}
                    onChange={handleChange}
                    error={Boolean(errors.province)}
                    helperText={errors.province}
                  />
                </Grid>
              </Grid>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Box
                sx={{
                  height: 150,
                  overflowY: 'scroll',
                  border: '1px solid #ccc',
                  p: 2,
                  mb: 2,
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">
                  <strong>Clinic Terms & Conditions:</strong>
                  <br /><br />
                  1. By registering your clinic, you confirm that your clinic is a licensed healthcare provider.
                  <br />
                  2. All information provided must be accurate and up-to-date.
                  <br />
                  3. You agree to maintain patient confidentiality and comply with all applicable healthcare regulations.
                  <br />
                  4. Appointments and service availability are subject to change based on operational requirements.
                  <br />
                  5. The clinic is responsible for ensuring that its data is secure and properly managed.
                  <br />
                  6. Use of this platform is governed by our privacy policy and service agreements.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    color="primary"
                  />
                }
                label="I agree to the Clinic Terms & Conditions"
              />
              {errors.terms && (
                <Typography variant="caption" color="error">{errors.terms}</Typography>
              )}
            </>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Register' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ClinicRegisterPage;
