import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Container, Box, Typography } from '@mui/material';
import EmotionMonitor from '../app/components/EmotionMonitor';
import ChatInterface from '../app/components/ChatInterface';
import MusicPlayer from '../app/components/MusicPlayer';
import Dashboard from '../app/components/Dashboard';

export default function Home() {
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [eegData, setEegData] = useState<number[] | null>(null);
  const [musicPlaying, setMusicPlaying] = useState<string | null>(null);

  return (
    <div>
      <Head>
        <title>Emotion-Responsive AI Interface</title>
        <meta name="description" content="An application that responds to your emotions using EEG signals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Emotion-Responsive AI Interface
          </Typography>
          
          <Dashboard 
            currentEmotion={currentEmotion} 
            eegData={eegData}
            musicPlaying={musicPlaying}
          />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 4 }}>
            <Box sx={{ flex: 1 }}>
              <EmotionMonitor 
                onEmotionDetected={setCurrentEmotion} 
                onEegDataReceived={setEegData} 
              />
            </Box>
            
            <Box sx={{ flex: 2 }}>
              <ChatInterface currentEmotion={currentEmotion} />
            </Box>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <MusicPlayer 
              currentEmotion={currentEmotion} 
              onMusicPlaying={setMusicPlaying} 
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
} 