/**
 * LLM Service Utility
 * 
 * This module provides utilities for interacting with the DeepSeek v3 model via OpenRouter.
 * It handles message formatting, API communication, and tone adaptation based on emotions.
 */

import axios from 'axios';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  text: string;
  error?: string;
}

// Mapping of emotions to tone instructions for the LLM
export const emotionToTone = {
  happy: 'enthusiastic and upbeat',
  sad: 'empathetic and comforting',
  angry: 'calm and de-escalating',
  calm: 'peaceful and measured',
  fear: 'reassuring and supportive',
  surprise: 'engaged and attentive',
  neutral: 'balanced and informative'
};

type EmotionType = keyof typeof emotionToTone;

/**
 * Send a message to the DeepSeek model via OpenRouter API
 */
export async function sendMessageToLLM(
  messages: Message[],
  currentEmotion: string | null,
  apiKey: string
): Promise<LLMResponse> {
  if (!apiKey) {
    return { 
      text: "API key is missing. Please set your NEXT_PUBLIC_OPENROUTER_API_KEY in .env.local", 
      error: "API key missing" 
    };
  }
  
  try {
    const tone = currentEmotion ? emotionToTone[currentEmotion as EmotionType] || 'neutral and helpful' : 'neutral and helpful';
    
    // Add system message with emotional tone instruction
    const messagesWithSystem = [
      {
        role: 'system' as const,
        content: `You are a helpful assistant. The user is currently feeling ${currentEmotion || 'neutral'}. Please respond in a ${tone} tone. Be concise and helpful.`
      },
      ...messages
    ];
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-v3-mini',
        messages: messagesWithSystem
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const aiResponse = response.data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return { text: aiResponse };
  } catch (error: any) {
    console.error('Error calling LLM service:', error);
    
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    
    return {
      text: "Sorry, I encountered an error. Please try again later.",
      error: errorMessage
    };
  }
}

/**
 * Get a music genre recommendation from the LLM based on the user's emotion
 */
export async function getMusicRecommendation(
  emotion: string | null,
  apiKey: string
): Promise<string> {
  if (!emotion) return 'lofi study beats';
  
  try {
    const messages: Message[] = [
      {
        role: 'user',
        content: `I'm feeling ${emotion}. What genre of music would be appropriate for this emotional state? Keep your answer to just the genre name, nothing else.`
      }
    ];
    
    const response = await sendMessageToLLM(messages, 'neutral', apiKey);
    
    // Clean up the response to just get the genre
    const genre = response.text
      .replace(/^"/, '') // Remove starting quote if present
      .replace(/"$/, '') // Remove ending quote if present
      .trim();
    
    return genre || emotionToGenre(emotion);
  } catch (error) {
    console.error('Error getting music recommendation:', error);
    return emotionToGenre(emotion);
  }
}

/**
 * Fallback function to determine music genre based on emotion
 */
function emotionToGenre(emotion: string): string {
  const genreMap: Record<string, string> = {
    happy: 'upbeat happy music',
    sad: 'melancholic piano music',
    angry: 'calming ambient music',
    calm: 'relaxing meditation music',
    fear: 'soothing acoustic music',
    surprise: 'inspirational orchestral music',
    neutral: 'lofi study beats'
  };
  
  return genreMap[emotion as keyof typeof genreMap] || 'lofi study beats';
} 