import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useAuth } from '../contexts/AuthContext';
import UserDashboard from '../components/UserDashboard';

const healthTips = [
  "Stay hydrated: Drink at least 8 glasses of water a day!",
  "Eat more fruits and veggies for better immunity.",
  "Don't skip breakfast - it fuels your day!",
  "Stretch in the morning to get your blood flowing.",
  "Take short walks during breaks to stay active.",
  "Get at least 7-8 hours of sleep for recovery.",
  "Practice deep breathing to reduce stress.",
  "Wash your hands frequently to stay safe from infections."
];

const didYouKnowFacts = [
  "Your body has about 60,000 miles of blood vessels. That’s enough to wrap around the world more than twice!",
  "The human brain uses about 20% of your body's oxygen and calories.",
  "Laughing is good for your heart and can increase blood flow by 20%.",
  "A single sneeze travels at about 100 miles per hour.",
  "Your bones are about 5 times stronger than steel of the same density."
];

const AutoScrollingText = ({ items, icon, label }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', minHeight: '100px' }}>
      {icon}
      <Typography>
        <strong>{label}</strong> {items[index]}
      </Typography>
    </Paper>
  );
};

const UserHome = () => {
    const {auth} = useAuth(); 

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Message */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f0f8ff' }}>
        <Typography variant="h4" gutterBottom>
          Hey there, {auth.user.firstName}👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We hope you're feeling alright today. If not, no worries—we’re here to help you find the care you need. 💙 Stay strong, and let’s get you on the path to feeling better!
        </Typography>
      </Paper>

      <UserDashboard />

      {/* Auto-scrolling Health Tip & Educational Fact */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AutoScrollingText
            items={healthTips}
            icon={<LightbulbIcon color="warning" sx={{ mr: 2 }} />}
            label="Today's Health Tip:"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AutoScrollingText
            items={didYouKnowFacts}
            icon={<LocalHospitalIcon color="error" sx={{ mr: 2 }} />}
            label="Did you know?"
          />
        </Grid>
      </Grid>

      {/* More sections can go below */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Stay safe and healthy 💖
        </Typography>
      </Box>
    </Box>
  );
};

export default UserHome;
