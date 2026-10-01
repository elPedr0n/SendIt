import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HomeScreen() {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <Text className="text-3xl font-extrabold text-emerald-400 mb-2 tracking-wider">
        SENDIT
      </Text>
      <Text className="text-slate-400 text-center mb-8 text-base">
        Activity & Workout Habit Tracker
      </Text>

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        className="bg-emerald-500 px-6 py-4 rounded-xl shadow-lg active:bg-emerald-600 w-full max-w-xs items-center"
      >
        <Text className="text-slate-950 font-bold text-lg">
          Test Haptic & Ready
        </Text>
      </TouchableOpacity>
    </View>
  );
}

