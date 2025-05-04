import { useState, useEffect, useCallback } from 'react';
import { NeuralNetwork } from 'brain.js';
import { EegChannelData, extractFeatures, normalizeFeatures } from '../utils/eegProcessor';

const EMOTIONS = ['happy', 'sad', 'angry', 'calm', 'fear', 'surprise', 'neutral'];

export interface EmotionClassifierHook {
  classify: (eegData: EegChannelData[]) => Promise<string>;
  isTraining: boolean;
  trainError: string | null;
  isReady: boolean;
}

/**
 * Custom hook for emotion classification using brain.js
 */
export function useEmotionClassifier(): EmotionClassifierHook {
  const [classifier, setClassifier] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainError, setTrainError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Initialize and train the classifier
  useEffect(() => {
    const initClassifier = async () => {
      try {
        setIsTraining(true);
        setTrainError(null);
        
        // Create a new neural network
        const net = new NeuralNetwork({
          hiddenLayers: [10, 10],
          activation: 'sigmoid'
        });
        
        // Sample training data
        // In a real implementation, you would use actual EEG data
        // associated with known emotional states
        const trainData = [
          // Happy patterns (higher alpha waves in left frontal region)
          { input: { eeg1: 0.8, eeg2: 0.6, eeg3: 0.5, eeg4: 0.4, eeg5: 0.3, eeg6: 0.3, eeg7: 0.2, eeg8: 0.2 }, output: { happy: 1 } },
          { input: { eeg1: 0.7, eeg2: 0.7, eeg3: 0.6, eeg4: 0.3, eeg5: 0.4, eeg6: 0.2, eeg7: 0.3, eeg8: 0.3 }, output: { happy: 1 } },
          
          // Sad patterns (higher alpha waves in right frontal region)
          { input: { eeg1: 0.3, eeg2: 0.4, eeg3: 0.4, eeg4: 0.5, eeg5: 0.7, eeg6: 0.8, eeg7: 0.6, eeg8: 0.5 }, output: { sad: 1 } },
          { input: { eeg1: 0.2, eeg2: 0.3, eeg3: 0.5, eeg4: 0.5, eeg5: 0.6, eeg6: 0.7, eeg7: 0.7, eeg8: 0.6 }, output: { sad: 1 } },
          
          // Angry patterns
          { input: { eeg1: 0.7, eeg2: 0.8, eeg3: 0.7, eeg4: 0.7, eeg5: 0.7, eeg6: 0.8, eeg7: 0.9, eeg8: 0.8 }, output: { angry: 1 } },
          { input: { eeg1: 0.8, eeg2: 0.7, eeg3: 0.8, eeg4: 0.8, eeg5: 0.6, eeg6: 0.7, eeg7: 0.8, eeg8: 0.7 }, output: { angry: 1 } },
          
          // Calm patterns
          { input: { eeg1: 0.3, eeg2: 0.3, eeg3: 0.4, eeg4: 0.4, eeg5: 0.3, eeg6: 0.3, eeg7: 0.3, eeg8: 0.3 }, output: { calm: 1 } },
          { input: { eeg1: 0.4, eeg2: 0.3, eeg3: 0.3, eeg4: 0.3, eeg5: 0.4, eeg6: 0.3, eeg7: 0.4, eeg8: 0.4 }, output: { calm: 1 } },
          
          // Fear patterns
          { input: { eeg1: 0.6, eeg2: 0.7, eeg3: 0.8, eeg4: 0.7, eeg5: 0.9, eeg6: 0.8, eeg7: 0.7, eeg8: 0.9 }, output: { fear: 1 } },
          { input: { eeg1: 0.7, eeg2: 0.6, eeg3: 0.7, eeg4: 0.8, eeg5: 0.8, eeg6: 0.9, eeg7: 0.7, eeg8: 0.8 }, output: { fear: 1 } },
          
          // Surprise patterns
          { input: { eeg1: 0.9, eeg2: 0.8, eeg3: 0.7, eeg4: 0.6, eeg5: 0.7, eeg6: 0.8, eeg7: 0.9, eeg8: 0.7 }, output: { surprise: 1 } },
          { input: { eeg1: 0.8, eeg2: 0.9, eeg3: 0.8, eeg4: 0.7, eeg5: 0.6, eeg6: 0.7, eeg7: 0.8, eeg8: 0.8 }, output: { surprise: 1 } },
          
          // Neutral patterns
          { input: { eeg1: 0.5, eeg2: 0.5, eeg3: 0.5, eeg4: 0.5, eeg5: 0.5, eeg6: 0.5, eeg7: 0.5, eeg8: 0.5 }, output: { neutral: 1 } },
          { input: { eeg1: 0.4, eeg2: 0.5, eeg3: 0.6, eeg4: 0.5, eeg5: 0.5, eeg6: 0.4, eeg7: 0.5, eeg8: 0.6 }, output: { neutral: 1 } },
        ];
        
        // Train the neural network
        const trainingResult = await net.trainAsync(trainData, {
          iterations: 2000,
          errorThresh: 0.005,
          log: false,
          logPeriod: 100
        });
        
        console.log('Training completed:', trainingResult);
        
        setClassifier(net);
        setIsReady(true);
      } catch (error: any) {
        console.error('Error training classifier:', error);
        setTrainError(error.message || 'Unknown error during training');
      } finally {
        setIsTraining(false);
      }
    };
    
    initClassifier();
  }, []);
  
  // Classify emotions based on EEG data
  const classify = useCallback(async (eegData: EegChannelData[]): Promise<string> => {
    if (!classifier || !isReady) {
      return 'neutral';
    }
    
    try {
      // Extract features from the EEG data
      const features = extractFeatures(eegData);
      
      // Normalize features to 0-1 range
      const normalizedFeatures = normalizeFeatures(features);
      
      // Run the classifier
      const result = classifier.run(normalizedFeatures);
      
      // Find the emotion with the highest score
      let highestScore = 0;
      let detectedEmotion = 'neutral';
      
      EMOTIONS.forEach(emotion => {
        if (result[emotion] > highestScore) {
          highestScore = result[emotion];
          detectedEmotion = emotion;
        }
      });
      
      return detectedEmotion;
    } catch (error) {
      console.error('Classification error:', error);
      return 'neutral';
    }
  }, [classifier, isReady]);
  
  return {
    classify,
    isTraining,
    trainError,
    isReady
  };
} 