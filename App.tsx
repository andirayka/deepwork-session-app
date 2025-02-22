import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';

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
    if (!targetTime) {
      deactivateKeepAwake();
      return;
    }

    activateKeepAwakeAsync();
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setTargetTime(null);
        deactivateKeepAwake();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const handleTimeChange = (hours: number, minutes: number) => {
    const now = new Date();
    const target = new Date();
    target.setHours(hours);
    target.setMinutes(minutes);
    target.setSeconds(0);

    // If target time is earlier than current time, set it for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    setTargetTime(target);
    setShowPicker(false);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-950">
      <View className="w-full items-center px-6">
        <Text className="mb-12 text-4xl font-bold tracking-tight text-white">
          Deep Work Session
        </Text>

        <View
          className={`'max-w-xs' flex w-full items-center justify-center rounded-3xl border border-gray-700 bg-gray-800 p-8 shadow-2xl`}>
          <Text className="text-center font-mono text-7xl text-gray-100">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </Text>
        </View>

        <View className={`flex-row gap-4 ${targetTime ? 'mt-8' : 'mt-12'}`}>
          <Pressable
            onPress={() => setShowPicker(true)}
            className={`rounded-xl px-8 py-4 shadow-lg active:bg-blue-800
              ${targetTime ? 'bg-blue-800' : 'bg-blue-700'}`}>
            <Text className="text-lg font-semibold text-gray-100">
              {targetTime ? 'Change Time' : 'Set Time'}
            </Text>
          </Pressable>

          {targetTime && (
            <Pressable
              onPress={() => {
                setTargetTime(null);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                deactivateKeepAwake();
              }}
              className="rounded-xl bg-red-700 px-8 py-4 shadow-lg active:bg-red-800">
              <Text className="text-lg font-semibold text-gray-100">Stop</Text>
            </Pressable>
          )}
        </View>

        <TimerPickerModal
          visible={showPicker}
          setIsVisible={setShowPicker}
          onConfirm={(pickedDuration) => {
            handleTimeChange(pickedDuration.hours, pickedDuration.minutes);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          modalTitle="Select Time"
          onCancel={() => {
            setShowPicker(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }}
          closeOnOverlayPress
          Audio={Audio}
          LinearGradient={LinearGradient}
          Haptics={Haptics}
          styles={{
            theme: 'dark',
          }}
          modalProps={{
            overlayOpacity: 0.7,
          }}
          use12HourPicker
        />
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
