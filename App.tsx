import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable } from 'react-native';

import './global.css';

export default function App() {
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setTargetTime(null);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const now = new Date();
      if (selectedDate.getTime() <= now.getTime()) {
        alert('Please select a future time');
        return;
      }
      setTargetTime(selectedDate);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <View className="w-full items-center px-6">
        <Text className="mb-12 text-4xl font-bold tracking-tight text-blue-900">
          Deep Work Session
        </Text>

        <View className="mb-12 w-full max-w-xs rounded-3xl border border-blue-100/50 bg-white p-8 shadow-2xl">
          <Text className="text-center font-mono text-6xl text-blue-900">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowPicker(true)}
          className={`rounded-xl bg-blue-600 px-8 py-4 shadow-lg active:bg-blue-700
            ${targetTime ? 'bg-blue-700' : 'bg-blue-600'}`}>
          <Text className="text-lg font-semibold text-white">
            {targetTime ? 'Change Time' : 'Set Timer'}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={targetTime || new Date()}
            mode="time"
            onChange={handleTimeChange}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
