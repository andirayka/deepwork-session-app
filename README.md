# Deep Work Session App

A minimalist mobile application designed to help you maintain focus during deep work sessions. Built with React Native and Expo, this app provides a clean interface for setting and tracking focused work periods.

## Features

- **Intuitive Timer Interface**: Simple and distraction-free design for setting work session durations
- **Keep Screen Awake**: Automatically keeps your device awake during active sessions
- **Audio & Haptic Feedback**: Pleasant notification sounds and haptic feedback when sessions complete
- **Persistent Alarm**: Repeating alarm that continues until manually stopped, ensuring you never miss the end of a session
- **Dark Theme**: Easy on the eyes with a carefully designed dark interface

## Tech Stack

- **React Native**: Core framework for cross-platform mobile development
- **Expo**: Development platform for easy building and deployment
- **NativeWind**: Utility-first CSS framework for styling
- **TypeScript**: For type-safe code and better development experience

## Getting Started

### Prerequisites

- Node.js (v10.7.0 or later)
- npm (included with Node.js)
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd deepwork-session-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Follow the Expo CLI instructions to run the app on your preferred platform (iOS/Android)

## Development

### Available Scripts

- `npm start`: Start the Expo development server
- `npm run ios`: Run the app in iOS simulator
- `npm run android`: Run the app in Android emulator
- `npm run lint`: Run ESLint for code quality checks
- `npm run format`: Format code using ESLint and Prettier

### Project Structure

```
deepwork-session-app/
├── App.tsx              # Main application component
├── assets/             # Images, fonts, and other static files
├── global.css          # Global styles
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # TailwindCSS configuration
```
