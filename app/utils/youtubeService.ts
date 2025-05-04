/**
 * YouTube Service Utility
 * 
 * This module provides utilities for searching and playing YouTube videos
 * based on the user's emotional state.
 */

import axios from 'axios';

export interface YouTubeTrack {
  id: string;
  title: string;
  thumbnail?: string;
}

// Fallback data for when the API call fails
const fallbackTracks: Record<string, YouTubeTrack[]> = {
  'upbeat happy music': [
    { id: 'dQw4w9WgXcQ', title: 'Happy Vibes' },
    { id: 'y6120QOlsfU', title: 'Uplifting Rhythm' },
    { id: 'L_jWHffIx5E', title: 'Sunny Day' }
  ],
  'melancholic piano music': [
    { id: 'rR94NDIfGmA', title: 'Rainy Day Piano' },
    { id: '4N3N1MlvVc4', title: 'Melancholy Sonata' },
    { id: 'wAPCSnAhhC8', title: 'Nostalgic Memories' }
  ],
  'calming ambient music': [
    { id: 'DWcJFNfaw9c', title: 'Tranquil Waters' },
    { id: 'lTRiuFIWV54', title: 'Forest Ambience' },
    { id: 'hHW1oY26kxQ', title: 'Peaceful Horizon' }
  ],
  'relaxing meditation music': [
    { id: '5qap5aO4i9A', title: 'Zen Garden' },
    { id: 'DfG6VKnjrVw', title: 'Inner Peace' },
    { id: 'lFcSrYw-ARY', title: 'Mindful Moments' }
  ],
  'soothing acoustic music': [
    { id: 'jdYJf_ybyVo', title: 'Gentle Guitar' },
    { id: 'HSOtku1j600', title: 'Acoustic Dreams' },
    { id: 'KkOF8UiB7u8', title: 'Campfire Melodies' }
  ],
  'inspirational orchestral music': [
    { id: 'oN2Xs-MvxLw', title: 'Epic Journey' },
    { id: 'FK30dkXOTck', title: 'New Horizons' },
    { id: 'XYKUeZQbMF0', title: 'Awakening' }
  ],
  'lofi study beats': [
    { id: '5qap5aO4i9A', title: 'Chill Beats to Study To' },
    { id: 'bmVKaAV_7-A', title: 'Lofi Cafe' },
    { id: 'DWcJFNfaw9c', title: 'Late Night Study Session' }
  ]
};

/**
 * Search for YouTube videos based on a genre query
 */
export async function searchYouTubeVideos(genre: string): Promise<YouTubeTrack[]> {
  try {
    const response = await axios.get('/api/youtube-search', {
      params: { query: genre }
    });
    
    return response.data.tracks || [];
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    
    // Return fallback data based on the genre
    const normalizedGenre = genre.toLowerCase();
    
    // Try to find a matching genre in the fallback data
    for (const key of Object.keys(fallbackTracks)) {
      if (normalizedGenre.includes(key) || key.includes(normalizedGenre)) {
        return fallbackTracks[key];
      }
    }
    
    // Default to lofi if no match found
    return fallbackTracks['lofi study beats'];
  }
}

/**
 * Get recommended genres based on emotion
 */
export function getRecommendedGenre(emotion: string | null): string {
  if (!emotion) return 'lofi study beats';
  
  const emotionToGenre: Record<string, string> = {
    happy: 'upbeat happy music',
    sad: 'melancholic piano music',
    angry: 'calming ambient music',
    calm: 'relaxing meditation music',
    fear: 'soothing acoustic music',
    surprise: 'inspirational orchestral music',
    neutral: 'lofi study beats'
  };
  
  return emotionToGenre[emotion] || 'lofi study beats';
}

/**
 * Load a YouTube player (wrapper for the YouTube iframe API)
 * 
 * In a real application, this would be a more sophisticated implementation
 * that properly handles the YouTube iframe API. For this prototype, we're
 * keeping it simple.
 */
export function loadYouTubePlayer(
  elementId: string,
  videoId: string,
  options: { 
    width?: number, 
    height?: number, 
    autoplay?: boolean 
  } = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    // This function would typically interact with the YouTube iframe API
    // to create and control a player instance
    
    // For the prototype, we'll just simulate success after a brief delay
    setTimeout(() => {
      console.log(`YouTube player loaded for video ${videoId} in element ${elementId}`);
      
      // Return a mock player object with basic controls
      const mockPlayer = {
        playVideo: () => console.log(`Playing video ${videoId}`),
        pauseVideo: () => console.log(`Pausing video ${videoId}`),
        stopVideo: () => console.log(`Stopping video ${videoId}`),
        setVolume: (volume: number) => console.log(`Setting volume to ${volume}`),
        getCurrentTime: () => Math.random() * 100,
        getDuration: () => 300, // 5 minutes
        videoId
      };
      
      resolve(mockPlayer);
    }, 500);
  });
}

/**
 * Get emotion-appropriate music descriptions
 */
export function getEmotionMusicDescription(emotion: string | null): string {
  if (!emotion) return 'Music to match your mood';
  
  const descriptions: Record<string, string> = {
    happy: 'Uplifting tunes to boost your happiness',
    sad: 'Comforting melodies for reflection',
    angry: 'Calming sounds to ease tension',
    calm: 'Peaceful ambient music to maintain tranquility',
    fear: 'Soothing melodies to provide reassurance',
    surprise: 'Inspirational music for this moment of wonder',
    neutral: 'Pleasant background music for focus'
  };
  
  return descriptions[emotion] || 'Music to match your mood';
} 