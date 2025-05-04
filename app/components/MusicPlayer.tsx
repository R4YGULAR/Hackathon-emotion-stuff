import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Slider, 
  IconButton,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import {
  searchYouTubeVideos,
  getRecommendedGenre,
  loadYouTubePlayer,
  getEmotionMusicDescription,
  YouTubeTrack
} from '../utils/youtubeService';

interface MusicPlayerProps {
  currentEmotion: string | null;
  onMusicPlaying: (title: string | null) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentEmotion, onMusicPlaying }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<YouTubeTrack | null>(null);
  const [volume, setVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState<YouTubeTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  // Load YouTube Player API script
  useEffect(() => {
    // This would load the YouTube IFrame API in a real application
    // For this prototype, we'll just simulate the player
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Cleanup
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);
  
  // Fetch tracks when emotion changes
  useEffect(() => {
    if (!currentEmotion) return;
    
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const genre = getRecommendedGenre(currentEmotion);
        
        // Fetch tracks from YouTube API (through our proxy API route)
        const fetchedTracks = await searchYouTubeVideos(genre);
        setTracks(fetchedTracks);
        
        if (fetchedTracks.length > 0 && isPlaying) {
          await loadAndPlayTrack(fetchedTracks[0]);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, [currentEmotion]);
  
  const loadAndPlayTrack = async (track: YouTubeTrack) => {
    try {
      // In a real app, this would initialize a YouTube player
      if (!playerRef.current) {
        // Initialize player if not already done
        playerRef.current = await loadYouTubePlayer('youtube-player', track.id, {
          width: 0,
          height: 0,
          autoplay: true
        });
      } else {
        // Change video if player already exists
        // This would use the YouTube iframe API's loadVideoById method
        console.log(`Loading video ID: ${track.id}`);
      }
      
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Simulate track progress
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5; // Increment by 0.5% every interval
        });
      }, 1000);
      
      onMusicPlaying(track.title);
    } catch (error) {
      console.error('Error loading track:', error);
    }
  };
  
  const handlePlayPause = () => {
    if (!currentTrack && tracks.length > 0) {
      loadAndPlayTrack(tracks[0]);
      return;
    }
    
    if (isPlaying) {
      // Pause the player
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setIsPlaying(false);
      onMusicPlaying(null);
      
      // In a real app, this would call pauseVideo() on the YouTube player
    } else {
      // Resume playing
      setIsPlaying(true);
      
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
      
      if (currentTrack) {
        onMusicPlaying(currentTrack.title);
      }
      
      // In a real app, this would call playVideo() on the YouTube player
    }
  };
  
  const handleNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    loadAndPlayTrack(tracks[nextIndex]);
  };
  
  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    
    // In a real app, this would set the volume on the YouTube player
    if (playerRef.current) {
      // playerRef.current.setVolume(newVolume);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real app, this would mute/unmute the YouTube player
    if (playerRef.current) {
      // if (isMuted) {
      //   playerRef.current.setVolume(volume);
      // } else {
      //   playerRef.current.setVolume(0);
      // }
    }
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Music Player
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {currentEmotion ? (
                getEmotionMusicDescription(currentEmotion)
              ) : (
                'Select an emotion to get personalized music'
              )}
            </Typography>
            
            <Typography variant="h6" noWrap>
              {currentTrack ? currentTrack.title : 'No track selected'}
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', mb: 2 }}>
            <Slider
              value={progress}
              disabled
              sx={{ color: '#1976d2' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handlePlayPause} 
                color="primary" 
                disabled={tracks.length === 0}
                sx={{ mr: 1 }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              
              <IconButton 
                onClick={handleNext} 
                color="primary" 
                disabled={tracks.length <= 1}
              >
                <SkipNextIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', width: 150 }}>
              <IconButton onClick={toggleMute} color="primary">
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              <Slider
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                sx={{ ml: 1 }}
                size="small"
              />
            </Box>
          </Box>
          
          {/* Hidden player container that would hold the YouTube iframe in a real implementation */}
          <div ref={playerContainerRef} id="youtube-player" style={{ display: 'none' }}></div>
          
          {tracks.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Up Next:
              </Typography>
              
              {tracks.slice(0, 3).map((track, index) => (
                <Box 
                  key={track.id}
                  sx={{ 
                    py: 1, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: currentTrack && currentTrack.id === track.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)'
                    },
                    borderRadius: 1,
                    pl: 1
                  }}
                  onClick={() => loadAndPlayTrack(track)}
                >
                  <Typography variant="body2" noWrap>
                    {index + 1}. {track.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default MusicPlayer; 