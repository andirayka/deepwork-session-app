import { createAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, Pressable } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';

import './global.css';

/**
 * Main application component for the Deep Work Session timer.
 * Provides functionality to set and track focused work sessions with a countdown timer.
 */

export default function App() {
  // Stores the target end time for the timer
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  // Controls the visibility of the time picker modal
  const [showPicker, setShowPicker] = useState(false);
  // Reference to the sound object
  const soundRef = useRef<any>(null);
  // Tracks if the alarm is currently playing
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  // Reference to the alarm interval
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Tracks the remaining time in hours, minutes, and seconds
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /**
   * Effect to load and unload sound resources
   */
  useEffect(() => {
    return () => {
      // Unload sound and clear intervals when component unmounts
      if (soundRef.current) {
        soundRef.current.release();
      }
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }
    };
  }, []);

  /**
   * Stops the repeating alarm if it's active
   */
  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }

    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }

    setIsAlarmActive(false);
  };

  /**
   * Plays the notification sound once or repeatedly
   */
  const playNotificationSound = async () => {
    try {
      // Set alarm as active
      setIsAlarmActive(true);

      // Release previous sound if exists
      if (soundRef.current) {
        await soundRef.current.release();
        soundRef.current = null;
      }

      // Use the default alarm sound
      const soundSource = require('./assets/default-alarm.mp3');

      // Create a new sound object
      const player = createAudioPlayer(soundSource);
      soundRef.current = player;

      // Play the sound immediately
      player.play();

      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Clear any existing interval
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }

      // Set up repeating interval to play sound again
      alarmIntervalRef.current = setInterval(async () => {
        try {
          // Always play the sound again after the interval
          if (soundRef.current) {
            await soundRef.current.play();
          } else {
            // If sound reference is lost, recreate it
            const newPlayer = createAudioPlayer(soundSource);
            soundRef.current = newPlayer;
            newPlayer.play();
          }
          // Haptic feedback on each repeat
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (intervalError) {
          console.error('Error in alarm interval:', intervalError);
        }
      }, 2000); // Check more frequently (every 2 seconds)
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  /**
   * Effect hook to manage the countdown timer and device wake state.
   * Updates the remaining time every second and handles timer completion.
   */
  useEffect(() => {
    if (!targetTime) {
      deactivateKeepAwake();
      return;
    }

    // Keep device awake while timer is running
    activateKeepAwakeAsync();
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      // Handle timer completion
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setTargetTime(null);
        // Keep device awake while alarm is playing

        // Play repeating notification sound when timer ends
        playNotificationSound();
        return;
      }

      // Calculate remaining time components
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    // Cleanup interval on unmount or when target time changes
    return () => clearInterval(timer);
  }, [targetTime]);

  /**
   * Handles time selection from the picker.
   * Sets the target time and adjusts for next day if selected time has passed.
   */
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
        {/* App title */}
        <Text className="mb-12 text-4xl font-bold tracking-tight text-white">
          Deep Work Session
        </Text>

        {/* Timer display */}
        <View
          className={`'max-w-xs' flex w-full items-center justify-center rounded-3xl border border-gray-700 bg-gray-800 p-8 shadow-2xl`}>
          <Text className="text-center font-mono text-7xl text-gray-100">
            {timeLeft.hours > 0 && `${String(timeLeft.hours).padStart(2, '0')}:`}
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </Text>
        </View>

        {/* Control buttons */}
        <View className={`flex-row gap-4 ${targetTime ? 'mt-8' : 'mt-12'}`}>
          {/* Set Time button - shown when timer is not running */}
          {!targetTime && !isAlarmActive && (
            <>
              <Pressable
                onPress={() => setShowPicker(true)}
                className="rounded-xl bg-blue-700 px-8 py-4 shadow-lg active:bg-blue-800">
                <Text className="text-lg font-semibold text-gray-100">Set Time</Text>
              </Pressable>
            </>
          )}

          {/* Stop button - shown when timer is running or alarm is active */}
          {(targetTime || isAlarmActive) && (
            <Pressable
              onPress={() => {
                setTargetTime(null);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                stopAlarm();
                deactivateKeepAwake();
              }}
              className="rounded-xl bg-red-700 px-8 py-4 shadow-lg active:bg-red-800">
              <Text className="text-lg font-semibold text-gray-100">Stop</Text>
            </Pressable>
          )}
        </View>

        {/* Time picker modal */}
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
          }}
          closeOnOverlayPress
          LinearGradient={LinearGradient}
          Haptics={Haptics}
          styles={{
            theme: 'dark',
          }}
          modalProps={{
            overlayOpacity: 0.7,
          }}
          use12HourPicker
          hideSeconds
          initialValue={{
            hours: new Date().getHours() + 1 > 23 ? 0 : new Date().getHours() + 1,
            minutes: 0,
            seconds: 0,
          }}
        />
      </View>

      <StatusBar hidden />
    </SafeAreaView>
  );
}
