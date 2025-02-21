import { SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Deep Work Session</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
