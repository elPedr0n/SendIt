import { Pressable, Text, View } from 'react-native';
import { haptics } from '@/lib/haptics';

interface GoalPickerProps {
  value: number;
  onChange: (value: number) => void;
}

const DAYS = [1, 2, 3, 4, 5, 6, 7];

export function GoalPicker({ value, onChange }: GoalPickerProps) {
  return (
    <View className="flex-row gap-1.5" accessibilityRole="radiogroup" accessibilityLabel="Meta semanal">
      {DAYS.map((n) => {
        const selected = n === value;
        return (
          <Pressable
            key={n}
            accessibilityRole="radio"
            accessibilityLabel={`${n} ${n === 1 ? 'treino' : 'treinos'} por semana`}
            accessibilityState={{ selected }}
            onPress={() => {
              haptics.tap();
              onChange(n);
            }}
            className={`h-[52px] flex-1 items-center justify-center rounded-control active:opacity-80 ${selected ? 'bg-accent' : 'bg-surface-2'}`}
          >
            <Text className={`font-display text-2xl ${selected ? 'text-accent-ink' : 'text-ink-soft'}`}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function goalLabel(n: number) {
  return `${n} ${n === 1 ? 'treino' : 'treinos'} por semana`;
}
