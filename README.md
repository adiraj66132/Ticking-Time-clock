# Ticking Time Clock

A beautiful and feature-rich clock application built with React, TypeScript, and Tailwind CSS.

## Features

### 🕐 Clock
- Real-time digital clock display
- Multiple time formats (12/24 hour)
- Beautiful gradient animations
- Responsive design

### ⏱️ Timer
- Countdown timer with customizable duration
- **NEW**: Local storage persistence - remembers timer state when stopped
- **NEW**: Background tab support - continues running when switching tabs
- Visual feedback when timer completes
- Easy time adjustment controls

### ⏱️ Stopwatch
- High-precision stopwatch with millisecond accuracy
- **NEW**: Local storage persistence - remembers stopwatch state when stopped
- **NEW**: Background tab support - continues running when switching tabs
- Clean, readable display
- Start, pause, and reset functionality

## Recent Updates

### Local Storage Persistence
- Timer and Stopwatch now remember their state when the user stops them
- State is automatically saved to browser localStorage
- Includes remaining time, running state, and completion status
- Robust error handling for localStorage operations

### Background Tab Support
- **Timer and Stopwatch continue running when switching browser tabs**
- Uses Page Visibility API to detect tab focus changes
- Accurate timing even when the tab is not active
- Automatic time calculation when returning to the tab
- Persistent state across browser sessions

### Font Updates
- Replaced Google Fonts (Nunito) with Times New Roman
- Improved performance by removing external font dependencies
- Maintains elegant typography throughout the application

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:8080`

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Radix UI** for accessible components

## Local Storage Keys

The application uses the following localStorage keys:
- `timerState`: Stores timer configuration, state, and timing data
- `stopwatchState`: Stores stopwatch elapsed time, running state, and timing data

### Timer State Structure:
```javascript
{
  totalTime: number,        // Total timer duration in milliseconds
  remainingTime: number,    // Remaining time in milliseconds
  isRunning: boolean,       // Whether timer is currently running
  isFinished: boolean,      // Whether timer has completed
  startTime: number | null, // When timer was started (timestamp)
  lastUpdateTime: number    // Last update timestamp for accuracy
}
```

### Stopwatch State Structure:
```javascript
{
  time: number,             // Elapsed time in milliseconds
  isRunning: boolean,       // Whether stopwatch is currently running
  startTime: number | null, // When stopwatch was started (timestamp)
  lastUpdateTime: number    // Last update timestamp for accuracy
}
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
