# Deep Work Session App

A minimalist mobile application designed to help you maintain focus during deep work sessions. Built with React Native and Expo.

## Features

- **Countdown Timer**: Set and track your deep work sessions with a precise countdown timer
- **Time Selection**: Intuitive time picker interface with 12-hour format
- **Screen Wake Lock**: Prevents screen from sleeping during active sessions
- **Haptic Feedback**: Provides tactile feedback for user interactions
- **Dark Theme**: Eye-friendly dark interface for better focus
- **Modern UI**: Clean and distraction-free design with smooth animations

## Technical Implementation

### Core Technologies

- React Native with Expo
- TypeScript for type safety
- NativeWind (TailwindCSS) for styling
- React Native Timer Picker for time selection

### Key Components

#### Timer Management
- Uses React's `useState` and `useEffect` hooks for timer state management
- Implements precise time calculations using JavaScript's `Date` object
- Handles time overflow by automatically scheduling for next day if selected time has passed

#### Screen Wake Lock
- Utilizes `expo-keep-awake` to prevent screen sleep during active sessions
- Automatically manages wake lock state based on timer status

#### User Interface
- Implements haptic feedback using `expo-haptics` for better user experience
- Uses `SafeAreaView` for proper layout on different devices
- Responsive design with TailwindCSS classes

## Development Setup

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn start
```

3. Run on iOS/Android:
```bash
# For iOS
yarn ios

# For Android
yarn android
```

## Project Structure

```
├── App.tsx              # Main application component
├── assets/              # App icons and images
├── global.css           # Global styles
├── tailwind.config.js   # TailwindCSS configuration
└── package.json         # Project dependencies and scripts
```

## Dependencies

- `expo`: ^52.0.35
- `expo-keep-awake`: ~14.0.3
- `expo-status-bar`: ~2.0.1
- `nativewind`: latest
- `react`: 18.3.1
- `react-native`: 0.76.7
- `react-native-timer-picker`: ^2.1.0

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License.