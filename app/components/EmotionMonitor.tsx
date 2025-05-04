import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { NeuralNetwork } from 'brain.js';

interface EmotionMonitorProps {
  onEmotionDetected: (emotion: string) => void;
  onEegDataReceived: (data: number[]) => void;
}

// EEG data channels from Unicorn API
interface EegChannelData {
  eeg1: number;
  eeg2: number;
  eeg3: number;
  eeg4: number;
  eeg5: number;
  eeg6: number;
  eeg7: number;
  eeg8: number;
  timestamp: number;
}

const EMOTIONS = ['happy', 'sad', 'angry', 'calm', 'fear', 'surprise', 'neutral'];

// Simulated EEG data for development/testing
const generateSimulatedEegData = (): EegChannelData => {
  return {
    eeg1: Math.random() * 100 - 50,
    eeg2: Math.random() * 100 - 50,
    eeg3: Math.random() * 100 - 50,
    eeg4: Math.random() * 100 - 50,
    eeg5: Math.random() * 100 - 50,
    eeg6: Math.random() * 100 - 50,
    eeg7: Math.random() * 100 - 50,
    eeg8: Math.random() * 100 - 50,
    timestamp: Date.now()
  };
};

const EmotionMonitor: React.FC<EmotionMonitorProps> = ({ onEmotionDetected, onEegDataReceived }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eegData, setEegData] = useState<EegChannelData[]>([]);
  const [emotionClassifier, setEmotionClassifier] = useState<any>(null);
  const dataBuffer = useRef<EegChannelData[]>([]);
  
  // Initialize the neural network for emotion classification
  useEffect(() => {
    const net = new NeuralNetwork({
      hiddenLayers: [10, 10],
      activation: 'sigmoid'
    });
    
    // We'll pretrain this network with some sample data
    // In a real application, you would load a pre-trained model
    const trainData = [
      // Happy patterns (higher alpha waves in left frontal region)
      { input: { eeg1: 0.8, eeg2: 0.6, eeg3: 0.5, eeg4: 0.4, eeg5: 0.3, eeg6: 0.3, eeg7: 0.2, eeg8: 0.2 }, output: { happy: 1 } },
      // Sad patterns (higher alpha waves in right frontal region)
      { input: { eeg1: 0.3, eeg2: 0.4, eeg3: 0.4, eeg4: 0.5, eeg5: 0.7, eeg6: 0.8, eeg7: 0.6, eeg8: 0.5 }, output: { sad: 1 } },
      // Angry patterns
      { input: { eeg1: 0.7, eeg2: 0.8, eeg3: 0.7, eeg4: 0.7, eeg5: 0.7, eeg6: 0.8, eeg7: 0.9, eeg8: 0.8 }, output: { angry: 1 } },
      // Calm patterns
      { input: { eeg1: 0.3, eeg2: 0.3, eeg3: 0.4, eeg4: 0.4, eeg5: 0.3, eeg6: 0.3, eeg7: 0.3, eeg8: 0.3 }, output: { calm: 1 } },
      // Fear patterns
      { input: { eeg1: 0.6, eeg2: 0.7, eeg3: 0.8, eeg4: 0.7, eeg5: 0.9, eeg6: 0.8, eeg7: 0.7, eeg8: 0.9 }, output: { fear: 1 } },
      // Surprise patterns
      { input: { eeg1: 0.9, eeg2: 0.8, eeg3: 0.7, eeg4: 0.6, eeg5: 0.7, eeg6: 0.8, eeg7: 0.9, eeg8: 0.7 }, output: { surprise: 1 } },
      // Neutral patterns
      { input: { eeg1: 0.5, eeg2: 0.5, eeg3: 0.5, eeg4: 0.5, eeg5: 0.5, eeg6: 0.5, eeg7: 0.5, eeg8: 0.5 }, output: { neutral: 1 } },
    ];
    
    net.train(trainData, {
      iterations: 2000,
      errorThresh: 0.005,
      log: false
    });
    
    setEmotionClassifier(net);
  }, []);
  
  // Connect to Unicorn Device (simulated for now)
  const connectToUnicorn = () => {
    try {
      setError(null);
      
      // In a real implementation, we would connect to the Unicorn device here
      // For now, we'll simulate the connection
      setIsConnected(true);
      
      // Start receiving data
      const intervalId = setInterval(() => {
        const newData = generateSimulatedEegData();
        dataBuffer.current = [...dataBuffer.current, newData].slice(-100); // Keep last 100 samples
        setEegData(prevData => [...prevData, newData].slice(-10)); // Show last 10 samples
        
        // Extract raw data for parent component
        const rawData = [
          newData.eeg1, newData.eeg2, newData.eeg3, newData.eeg4,
          newData.eeg5, newData.eeg6, newData.eeg7, newData.eeg8
        ];
        onEegDataReceived(rawData);
      }, 100);
      
      return () => clearInterval(intervalId);
    } catch (err: any) {
      setError(`Failed to connect: ${err.message}`);
      setIsConnected(false);
      return undefined;
    }
  };
  
  // Classify emotions based on EEG data
  const classifyEmotion = () => {
    if (!emotionClassifier || dataBuffer.current.length === 0) return;
    
    setIsClassifying(true);
    
    try {
      // Process the buffer of EEG data
      // In a real implementation, we would do more sophisticated feature extraction
      // For now, we'll just average the values
      const averageData = {
        eeg1: 0, eeg2: 0, eeg3: 0, eeg4: 0, eeg5: 0, eeg6: 0, eeg7: 0, eeg8: 0
      };
      
      dataBuffer.current.forEach(sample => {
        averageData.eeg1 += sample.eeg1 / dataBuffer.current.length;
        averageData.eeg2 += sample.eeg2 / dataBuffer.current.length;
        averageData.eeg3 += sample.eeg3 / dataBuffer.current.length;
        averageData.eeg4 += sample.eeg4 / dataBuffer.current.length;
        averageData.eeg5 += sample.eeg5 / dataBuffer.current.length;
        averageData.eeg6 += sample.eeg6 / dataBuffer.current.length;
        averageData.eeg7 += sample.eeg7 / dataBuffer.current.length;
        averageData.eeg8 += sample.eeg8 / dataBuffer.current.length;
      });
      
      // Normalize values to 0-1 range for the classifier
      Object.keys(averageData).forEach(key => {
        const k = key as keyof typeof averageData;
        // Map from -50 to 50 range to 0 to 1
        averageData[k] = (averageData[k] + 50) / 100;
      });
      
      // Run the classifier
      const result = emotionClassifier.run(averageData);
      
      // Find the emotion with the highest score
      let highestScore = 0;
      let detectedEmotion = 'neutral';
      
      EMOTIONS.forEach(emotion => {
        if (result[emotion] > highestScore) {
          highestScore = result[emotion];
          detectedEmotion = emotion;
        }
      });
      
      // Send the detected emotion up to the parent component
      onEmotionDetected(detectedEmotion);
    } catch (err: any) {
      setError(`Classification error: ${err.message}`);
    } finally {
      setIsClassifying(false);
    }
  };
  
  // Auto-classify every few seconds when connected
  useEffect(() => {
    if (!isConnected || !emotionClassifier) return;
    
    const classifierInterval = setInterval(() => {
      classifyEmotion();
    }, 2000); // Classify every 2 seconds
    
    return () => clearInterval(classifierInterval);
  }, [isConnected, emotionClassifier]);
  
  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;
    
    if (isConnected) {
      cleanupFunction = connectToUnicorn();
    }
    
    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
      setIsConnected(false);
    };
  }, [isConnected]);
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Brain Wave Monitor
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          color={isConnected ? "error" : "primary"}
          onClick={() => setIsConnected(!isConnected)}
          fullWidth
        >
          {isConnected ? "Disconnect" : "Connect to Unicorn"}
        </Button>
      </Box>
      
      <Box 
        className="brain-wave-container"
        sx={{ 
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {!isConnected && (
          <Typography color="text.secondary">
            Connect to visualize brain waves
          </Typography>
        )}
        
        {isConnected && eegData.length === 0 && (
          <CircularProgress />
        )}
        
        {isConnected && eegData.length > 0 && (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={eegData.map((data, i) => 
                `${i * (100 / (eegData.length - 1))},${50 + data.eeg1 / 2}`
              ).join(' ')}
              stroke="#4CAF50"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        )}
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Button 
          variant="outlined" 
          onClick={classifyEmotion}
          disabled={!isConnected || isClassifying}
          fullWidth
        >
          {isClassifying ? <CircularProgress size={24} /> : "Classify Emotion"}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmotionMonitor; 