/**
 * EEG Signal Processor Utility
 * 
 * This module provides utilities for processing EEG signals from the Unicorn API.
 * It includes functions for feature extraction, signal filtering, and data preparation
 * for the neural network classifier.
 */

export interface EegChannelData {
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

/**
 * Extract features from raw EEG data for emotion classification
 * In a real implementation, this would perform more sophisticated feature extraction
 * like frequency domain analysis, power spectral density, etc.
 */
export function extractFeatures(eegData: EegChannelData[]): Record<string, number> {
  if (!eegData.length) {
    throw new Error('No EEG data provided for feature extraction');
  }
  
  // Simple averaging of values as a placeholder
  // In a real application, you would calculate more complex features
  // like alpha/beta/theta/delta power ratios, asymmetry indices, etc.
  const features = {
    eeg1: 0, eeg2: 0, eeg3: 0, eeg4: 0, 
    eeg5: 0, eeg6: 0, eeg7: 0, eeg8: 0
  };
  
  eegData.forEach(sample => {
    features.eeg1 += sample.eeg1 / eegData.length;
    features.eeg2 += sample.eeg2 / eegData.length;
    features.eeg3 += sample.eeg3 / eegData.length;
    features.eeg4 += sample.eeg4 / eegData.length;
    features.eeg5 += sample.eeg5 / eegData.length;
    features.eeg6 += sample.eeg6 / eegData.length;
    features.eeg7 += sample.eeg7 / eegData.length;
    features.eeg8 += sample.eeg8 / eegData.length;
  });
  
  return features;
}

/**
 * Normalize EEG features to a 0-1 range for the neural network
 */
export function normalizeFeatures(features: Record<string, number>, min: number = -50, max: number = 50): Record<string, number> {
  const normalized = { ...features };
  
  Object.keys(normalized).forEach(key => {
    const k = key as keyof typeof normalized;
    // Map from min-max range to 0-1
    normalized[k] = (normalized[k] - min) / (max - min);
    
    // Clamp values to 0-1 range
    normalized[k] = Math.max(0, Math.min(1, normalized[k]));
  });
  
  return normalized;
}

/**
 * Generate simulated EEG data for testing
 * This would be replaced with actual data from the Unicorn API
 */
export function generateSimulatedEegData(): EegChannelData {
  return {
    eeg1: Math.random() * 100 - 50, // Random values between -50 and 50
    eeg2: Math.random() * 100 - 50,
    eeg3: Math.random() * 100 - 50,
    eeg4: Math.random() * 100 - 50,
    eeg5: Math.random() * 100 - 50,
    eeg6: Math.random() * 100 - 50,
    eeg7: Math.random() * 100 - 50,
    eeg8: Math.random() * 100 - 50,
    timestamp: Date.now()
  };
}

/**
 * Generate different simulated EEG patterns based on emotion
 * This is for demonstration purposes only
 */
export function generateEmotionPattern(emotion: string): EegChannelData {
  const basePattern = {
    timestamp: Date.now(),
    eeg1: 0, eeg2: 0, eeg3: 0, eeg4: 0,
    eeg5: 0, eeg6: 0, eeg7: 0, eeg8: 0
  };
  
  const randomize = (base: number) => base + (Math.random() * 10 - 5);
  
  switch (emotion) {
    case 'happy':
      // Higher activity in left frontal region (eeg1, eeg2)
      return {
        ...basePattern,
        eeg1: randomize(40),
        eeg2: randomize(30),
        eeg3: randomize(25),
        eeg4: randomize(20),
        eeg5: randomize(15),
        eeg6: randomize(15),
        eeg7: randomize(10),
        eeg8: randomize(10)
      };
      
    case 'sad':
      // Higher activity in right frontal region (eeg5, eeg6)
      return {
        ...basePattern,
        eeg1: randomize(15),
        eeg2: randomize(20),
        eeg3: randomize(20),
        eeg4: randomize(25),
        eeg5: randomize(35),
        eeg6: randomize(40),
        eeg7: randomize(30),
        eeg8: randomize(25)
      };
      
    case 'angry':
      // Higher overall activity
      return {
        ...basePattern,
        eeg1: randomize(35),
        eeg2: randomize(40),
        eeg3: randomize(35),
        eeg4: randomize(35),
        eeg5: randomize(35),
        eeg6: randomize(40),
        eeg7: randomize(45),
        eeg8: randomize(40)
      };
      
    case 'calm':
      // Lower overall activity, more balanced
      return {
        ...basePattern,
        eeg1: randomize(15),
        eeg2: randomize(15),
        eeg3: randomize(20),
        eeg4: randomize(20),
        eeg5: randomize(15),
        eeg6: randomize(15),
        eeg7: randomize(15),
        eeg8: randomize(15)
      };
      
    case 'fear':
      // High temporal and parietal activity
      return {
        ...basePattern,
        eeg1: randomize(30),
        eeg2: randomize(35),
        eeg3: randomize(40),
        eeg4: randomize(35),
        eeg5: randomize(45),
        eeg6: randomize(40),
        eeg7: randomize(35),
        eeg8: randomize(45)
      };
      
    case 'surprise':
      // Burst of activity
      return {
        ...basePattern,
        eeg1: randomize(45),
        eeg2: randomize(40),
        eeg3: randomize(35),
        eeg4: randomize(30),
        eeg5: randomize(35),
        eeg6: randomize(40),
        eeg7: randomize(45),
        eeg8: randomize(35)
      };
      
    default: // neutral
      // Balanced activity
      return {
        ...basePattern,
        eeg1: randomize(25),
        eeg2: randomize(25),
        eeg3: randomize(25),
        eeg4: randomize(25),
        eeg5: randomize(25),
        eeg6: randomize(25),
        eeg7: randomize(25),
        eeg8: randomize(25)
      };
  }
} 