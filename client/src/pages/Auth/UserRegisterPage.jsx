// src/pages/UserRegisterPage.jsx
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

const steps = ['Basic Information', 'Details', 'Privacy'];

function UserRegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [pfp, setPfp] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    pfpUrl: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPfp(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    }
    if (activeStep === 1) {
      if (!formData.email.trim()) newErrors.email = 'Required';
      if (!formData.password.trim()) newErrors.password = 'Required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Required';
    }
    if (activeStep === 2) {
      if (!termsAccepted) newErrors.terms = 'You must accept the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (activeStep === steps.length - 1) {
      let updatedFormData = { ...formData };
      if (image) {
        const uploadResult = await uploadImage(image);
        console.log("result", uploadResult);
        updatedFormData = { ...updatedFormData, pfpUrl: uploadResult };
      }
      try {
        console.log("formdata", updatedFormData);
        await registerUser(
          updatedFormData.firstName,
          updatedFormData.lastName,
          updatedFormData.email,
          updatedFormData.password,
          updatedFormData.phoneNumber,
          updatedFormData.pfpUrl
        );
        navigate('/user/home');
      } catch (err) {
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
            Welcome to FindYourDoctor!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create your account to start booking appointments with healthcare professionals.
          </Typography>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
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
                  src={pfp}
                  sx={{ width: 120, height: 120, cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                >
                  {!pfp && 'Upload'}
                </Avatar>
                <IconButton
                  sx={{ position: 'absolute', bottom: 0, right: 'calc(50% - 20px)' }}
                  onClick={handleAvatarClick}
                >
                  <EditIcon />
                </IconButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName}
                  />
                </Grid>
              </Grid>
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
            </>
          )}
          {activeStep === 2 && (
            <>
              <Box
                sx={{
                  height: 300,
                  overflowY: 'scroll',
                  border: '1px solid #ccc',
                  p: 2,
                  mb: 2,
                  borderRadius: 1
                }}
              >
                {terms}
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    color="primary"
                  />
                }
                label="I agree to the Terms and Conditions"
              />
              {errors.terms && (
                <Typography variant="caption" color="error">
                  {errors.terms}
                </Typography>
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

export default UserRegisterPage;


const terms = (<Typography variant="body2">
  <strong>Terms and Conditions for FindYourDoctor</strong>
  <br /><br />
  <strong>1. Introduction</strong>
  <br />
  Welcome to FindYourDoctor, a platform designed to connect users with healthcare professionals for the purpose of scheduling medical appointments. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
  <br /><br />
  <strong>2. Definitions</strong>
  <br />
  <strong>"User"</strong>: Any individual who accesses or uses the FindYourDoctor platform to seek medical appointments.<br />
  <strong>"Healthcare Professional"</strong>: Licensed medical practitioners, including doctors, clinics, and other healthcare providers, registered on our platform.<br />
  <strong>"Platform"</strong>: The FindYourDoctor website and mobile applications.<br />
  <br /><br />
  <strong>3. Scope of Services</strong>
  <br />
  FindYourDoctor provides a platform that enables Users to find and book appointments with Healthcare Professionals. We do not offer medical advice or services ourselves. The actual contract for medical services is between Users and Healthcare Professionals.
  <br /><br />
  <strong>4. User Responsibilities</strong>
  <br />
  <ul>
    <li><strong>Account Creation</strong>: Users must provide accurate and complete information during registration and keep their account information updated.</li>
    <li><strong>Confidentiality</strong>: Users are responsible for maintaining the confidentiality of their account credentials.</li>
    <li><strong>Prohibited Activities</strong>: Users shall not misuse the platform for unlawful activities, including but not limited to impersonating another person, posting false information, or attempting unauthorized access.</li>
  </ul>
  <br />
  <strong>5. Healthcare Professional Responsibilities</strong>
  <br />
  Healthcare Professionals must be licensed, provide accurate service information, and comply with applicable laws.
  <br /><br />
  <strong>6. Appointment Booking and Cancellation</strong>
  <br />
  Users can book and cancel appointments based on the Healthcare Professional’s policies. Cancellations by Healthcare Professionals will be communicated to Users.
  <br /><br />
  <strong>7. Fees and Payments</strong>
  <br />
  FindYourDoctor may charge a service fee. Payments are processed through third-party gateways, and refund policies are determined by Healthcare Professionals.
  <br /><br />
  <strong>8. Privacy and Data Protection</strong>
  <br />
  We collect, use, and share User data only as necessary to facilitate appointments. Security measures are in place, but we do not guarantee absolute security.
  <br /><br />
  <strong>9. Intellectual Property</strong>
  <br />
  All content on the platform belongs to FindYourDoctor. Users may not copy, modify, or distribute content without permission.
  <br /><br />
  <strong>10. Disclaimers</strong>
  <br />
  FindYourDoctor does not provide medical advice and is not liable for any issues arising from appointments.
  <br /><br />
  <strong>11. Indemnification</strong>
  <br />
  Users agree to indemnify FindYourDoctor against any claims arising from their use of the platform.
  <br /><br />
  <strong>12. Modifications to Terms</strong>
  <br />
  We may update these terms at any time. Continued use of the platform signifies acceptance.
  <br /><br />
  <strong>13. Governing Law</strong>
  <br />
  These terms are governed by the applicable jurisdiction.
  <br /><br />
  <strong>14. Contact Information</strong>
  <br />
  For any inquiries, contact us at support@findyourdoctor.com.
</Typography>
);
