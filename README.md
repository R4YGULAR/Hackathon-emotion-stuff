# Emotion-Responsive AI Interface

This application uses EEG signals from the Unicorn API by g.tec to detect a user's emotional state, then adapts its response in two key ways:

1. An AI assistant (powered by DeepSeek v3 via OpenRouter) changes its verbal tone based on the detected emotion
2. A music player automatically selects and plays YouTube music matching the user's emotional state

## Features

- **EEG-Based Emotion Detection**: Uses Brain.js neural network to classify emotions from EEG signals
- **Adaptive AI Responses**: Modifies the AI's conversation style based on detected emotions
- **Emotion-Driven Music Selection**: Plays music genres that match or complement the user's emotional state
- **Real-Time Visualization**: Displays brain wave patterns and current emotional state
- **Modern UI**: Built with Next.js and Material UI for a responsive, accessible interface

## Technical Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Library**: Material UI
- **Neural Network**: Brain.js
- **API Integration**:
  - Unicorn API (g.tec) for EEG signals
  - OpenRouter API for accessing DeepSeek v3 LLM
  - YouTube API for music playback
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v14+)
- An OpenRouter API key (for LLM access)
- A g.tec Unicorn device (or use the simulated mode for testing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Connect to the Unicorn device using the button in the Brain Wave Monitor
2. The system will automatically detect your emotional state
3. Interact with the AI chat, which will respond in a tone matching your emotional state
4. Music will automatically play based on your detected emotion
5. You can manually control the music player if desired

## Implementation Notes

- In the current prototype, the EEG signal processing uses a simulated implementation
- For production use, you would implement the actual Unicorn API connection
- The neural network is pre-trained with sample data; in a real application, you'd train it with real EEG data

## License

This project is licensed under the ISC License. 