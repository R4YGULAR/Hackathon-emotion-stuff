import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type YoutubeTrack = {
  id: string;
  title: string;
  thumbnail: string;
};

type ResponseData = {
  tracks: YoutubeTrack[];
  error?: string;
};

// Mock data for development/demo purposes
const mockResults: Record<string, YoutubeTrack[]> = {
  'upbeat happy music': [
    { id: 'dQw4w9WgXcQ', title: 'Happy Vibes', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
    { id: 'y6120QOlsfU', title: 'Uplifting Rhythm', thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/hqdefault.jpg' },
    { id: 'L_jWHffIx5E', title: 'Sunny Day', thumbnail: 'https://i.ytimg.com/vi/L_jWHffIx5E/hqdefault.jpg' }
  ],
  'melancholic piano music': [
    { id: 'rR94NDIfGmA', title: 'Rainy Day Piano', thumbnail: 'https://i.ytimg.com/vi/rR94NDIfGmA/hqdefault.jpg' },
    { id: '4N3N1MlvVc4', title: 'Melancholy Sonata', thumbnail: 'https://i.ytimg.com/vi/4N3N1MlvVc4/hqdefault.jpg' },
    { id: 'wAPCSnAhhC8', title: 'Nostalgic Memories', thumbnail: 'https://i.ytimg.com/vi/wAPCSnAhhC8/hqdefault.jpg' }
  ],
  'calming ambient music': [
    { id: 'DWcJFNfaw9c', title: 'Tranquil Waters', thumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
    { id: 'lTRiuFIWV54', title: 'Forest Ambience', thumbnail: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg' },
    { id: 'hHW1oY26kxQ', title: 'Peaceful Horizon', thumbnail: 'https://i.ytimg.com/vi/hHW1oY26kxQ/hqdefault.jpg' }
  ],
  'relaxing meditation music': [
    { id: '5qap5aO4i9A', title: 'Zen Garden', thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    { id: 'DfG6VKnjrVw', title: 'Inner Peace', thumbnail: 'https://i.ytimg.com/vi/DfG6VKnjrVw/hqdefault.jpg' },
    { id: 'lFcSrYw-ARY', title: 'Mindful Moments', thumbnail: 'https://i.ytimg.com/vi/lFcSrYw-ARY/hqdefault.jpg' }
  ],
  'soothing acoustic music': [
    { id: 'jdYJf_ybyVo', title: 'Gentle Guitar', thumbnail: 'https://i.ytimg.com/vi/jdYJf_ybyVo/hqdefault.jpg' },
    { id: 'HSOtku1j600', title: 'Acoustic Dreams', thumbnail: 'https://i.ytimg.com/vi/HSOtku1j600/hqdefault.jpg' },
    { id: 'KkOF8UiB7u8', title: 'Campfire Melodies', thumbnail: 'https://i.ytimg.com/vi/KkOF8UiB7u8/hqdefault.jpg' }
  ],
  'inspirational orchestral music': [
    { id: 'oN2Xs-MvxLw', title: 'Epic Journey', thumbnail: 'https://i.ytimg.com/vi/oN2Xs-MvxLw/hqdefault.jpg' },
    { id: 'FK30dkXOTck', title: 'New Horizons', thumbnail: 'https://i.ytimg.com/vi/FK30dkXOTck/hqdefault.jpg' },
    { id: 'XYKUeZQbMF0', title: 'Awakening', thumbnail: 'https://i.ytimg.com/vi/XYKUeZQbMF0/hqdefault.jpg' }
  ],
  'lofi study beats': [
    { id: '5qap5aO4i9A', title: 'Chill Beats to Study To', thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    { id: 'bmVKaAV_7-A', title: 'Lofi Cafe', thumbnail: 'https://i.ytimg.com/vi/bmVKaAV_7-A/hqdefault.jpg' },
    { id: 'DWcJFNfaw9c', title: 'Late Night Study Session', thumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' }
  ]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ tracks: [], error: 'Method not allowed' });
  }
  
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ tracks: [], error: 'Missing query parameter' });
  }
  
  try {
    // For a real implementation, we would call the YouTube API here
    // const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${apiKey}`;
    // const response = await axios.get(url);
    // const tracks = response.data.items.map((item: any) => ({
    //   id: item.id.videoId,
    //   title: item.snippet.title,
    //   thumbnail: item.snippet.thumbnails.medium.url
    // }));
    
    // For now, return mock data
    const queryString = query.toString().toLowerCase();
    
    // Find the best match in our mock data
    let bestMatch = 'lofi study beats'; // Default fallback
    
    for (const key of Object.keys(mockResults)) {
      if (queryString.includes(key) || key.includes(queryString)) {
        bestMatch = key;
        break;
      }
    }
    
    const tracks = mockResults[bestMatch] || mockResults['lofi study beats'];
    
    return res.status(200).json({ tracks });
  } catch (error: any) {
    console.error('YouTube search error:', error);
    return res.status(500).json({ 
      tracks: [], 
      error: error.message || 'Failed to fetch YouTube data' 
    });
  }
} 