import React from 'react';
import { Paper, Grid, Box, Typography, Chip } from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import SensorsIcon from '@mui/icons-material/Sensors';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface DashboardProps {
  currentEmotion: string | null;
  eegData: number[] | null;
  musicPlaying: string | null;
}

const emotionColors = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF6347',
  calm: '#90EE90',
  fear: '#8A2BE2',
  surprise: '#FF69B4',
  neutral: '#A9A9A9',
};

type EmotionType = keyof typeof emotionColors;

const Dashboard: React.FC<DashboardProps> = ({ currentEmotion, eegData, musicPlaying }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoodIcon 
              fontSize="large" 
              sx={{ 
                color: currentEmotion ? emotionColors[currentEmotion as EmotionType] || '#FFFFFF' : '#FFFFFF'
              }} 
            />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current Emotion
              </Typography>
              <Typography variant="h6">
                {currentEmotion ? (
                  <Chip 
                    label={currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)} 
                    sx={{ 
                      bgcolor: emotionColors[currentEmotion as EmotionType] || '#FFFFFF',
                      color: '#000000',
                      fontWeight: 'bold'
                    }} 
                  />
                ) : 'Not detected'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SensorsIcon fontSize="large" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                EEG Signal
              </Typography>
              <Typography variant="h6">
                {eegData ? 'Active' : 'Not connected'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MusicNoteIcon fontSize="large" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Music Playing
              </Typography>
              <Typography variant="h6" noWrap sx={{ maxWidth: '200px' }}>
                {musicPlaying || 'None'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Dashboard; 