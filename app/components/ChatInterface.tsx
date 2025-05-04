import React, { useState, useRef, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Avatar, 
  CircularProgress,
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface ChatInterfaceProps {
  currentEmotion: string | null;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Emotion-based tone mapping
const emotionToTone = {
  happy: 'enthusiastic and upbeat',
  sad: 'empathetic and comforting',
  angry: 'calm and de-escalating',
  calm: 'peaceful and measured',
  fear: 'reassuring and supportive',
  surprise: 'engaged and attentive',
  neutral: 'balanced and informative'
};

// Mock responses for testing without an API key
const mockResponses: Record<string, string[]> = {
  happy: [
    "That's fantastic! I'm so happy to hear that. What else is making you smile today?",
    "Wonderful news! Your positive energy is contagious. Tell me more!",
    "I'm thrilled things are going well for you! Let's keep that positive momentum going!"
  ],
  sad: [
    "I understand that feeling. It's okay to feel down sometimes. Would you like to talk about what's troubling you?",
    "I'm here for you during this difficult time. Remember that these feelings won't last forever.",
    "It sounds like you're going through a tough moment. Would sharing more about it help lighten the burden?"
  ],
  angry: [
    "I understand you're feeling frustrated. Let's take a step back and look at this calmly.",
    "It makes sense that you'd feel that way. Once we process these feelings, we can think about constructive next steps.",
    "Your feelings are valid. Would it help to talk through what triggered this reaction?"
  ],
  calm: [
    "It sounds like you're in a peaceful state of mind. That's a wonderful place to be for reflection.",
    "This tranquil energy is perfect for mindful conversation. What's on your mind today?",
    "I appreciate your centered approach. How can we maintain this balanced perspective?"
  ],
  fear: [
    "It's natural to feel anxious about this. Remember that you've overcome difficult situations before.",
    "I understand your concerns. Let's break this down into smaller, manageable parts.",
    "Your feelings of worry are completely valid. Would it help to discuss specific strategies for this situation?"
  ],
  surprise: [
    "Wow, that's unexpected! I'd love to hear more about this development.",
    "That's quite the surprise! How are you processing this new information?",
    "I can understand why that would catch you off guard! What aspect of this surprises you most?"
  ],
  neutral: [
    "Thanks for sharing that with me. Would you like to explore this topic further?",
    "I appreciate your perspective. What other thoughts do you have on this matter?",
    "That's an interesting point. Could you elaborate on what you mean?"
  ]
};

type EmotionType = keyof typeof emotionToTone;

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentEmotion }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
  
  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: 'Hello! How are you feeling today? I\'ll adapt my responses based on your emotional state.',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);
  
  // Scroll to bottom of chat whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const getMockResponse = (emotion: string | null): string => {
    const defaultEmotion = 'neutral';
    const emotionKey = (emotion || defaultEmotion) as EmotionType;
    const responses = mockResponses[emotionKey] || mockResponses[defaultEmotion];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      let aiResponse: string;
      
      // Check if we have an API key
      if (apiKey && apiKey !== 'your_openrouter_key_here') {
        // Create a system message that instructs the AI to respond based on the user's emotion
        const tone = currentEmotion ? emotionToTone[currentEmotion as EmotionType] : 'neutral and helpful';
        
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'deepseek/deepseek-v3-mini',
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant. The user is currently feeling ${currentEmotion || 'neutral'}. Please respond in a ${tone} tone. Be concise and helpful.`
              },
              ...messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
              })),
              { role: 'user', content: input }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Extract the AI's response
        aiResponse = response.data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      } else {
        // Use mock responses if no API key is provided
        aiResponse = getMockResponse(currentEmotion);
        
        // Add a small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // If API error, fall back to mock response
      const mockResponse = getMockResponse(currentEmotion);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: mockResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 0, 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h5">Chat</Typography>
        {currentEmotion && (
          <Chip 
            label={`Detected: ${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`} 
            size="small" 
            color="primary" 
          />
        )}
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: 'rgba(0, 0, 0, 0.1)'
      }}>
        {messages.map((message) => (
          <Box 
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                width: 36,
                height: 36
              }}
            >
              {message.sender === 'user' ? 'U' : 'AI'}
            </Avatar>
            
            <Paper 
              sx={{
                p: 2,
                maxWidth: '80%',
                borderRadius: 2,
                bgcolor: message.sender === 'user' ? 'primary.dark' : 'background.paper',
                boxShadow: 1
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        
        {isLoading && (
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'secondary.main',
                width: 36,
                height: 36
              }}
            >
              AI
            </Avatar>
            
            <Paper 
              sx={{
                p: 2,
                maxWidth: '80%',
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: 1
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          size="small"
        />
        <Button 
          variant="contained" 
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface; 