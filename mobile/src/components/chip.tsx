import { Pressable, Text } from 'react-native';
import { haptics } from '@/lib/haptics';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      className={`h-[42px] justify-center rounded-full px-4 active:opacity-80 ${selected ? 'bg-accent' : 'border border-line'}`}
    >
      <Text className={`font-body-semibold text-[15px] ${selected ? 'text-accent-ink' : 'text-ink-soft'}`}>{label}</Text>
    </Pressable>
  );
}
