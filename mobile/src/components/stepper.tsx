import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { colors } from '@/constants/theme';
import { haptics } from '@/lib/haptics';

interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step: number;
  min: number;
  max: number;
  unit?: string;
  decimals?: number;
}

// Botões de 64pt para usar com uma mão, sem teclado (RNF03).
export function Stepper({ label, value, onChange, step, min, max, unit, decimals = 0 }: StepperProps) {
  const change = (delta: number) => {
    const next = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    if (next !== value) {
      haptics.tap();
      onChange(next);
    }
  };
  const formatted = value.toFixed(decimals).replace('.', ',');

  return (
    <View className="flex-row items-center justify-between gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Diminuir ${label}`}
        disabled={value <= min}
        onPress={() => change(-step)}
        className="h-16 w-16 items-center justify-center rounded-[18px] bg-surface-2 active:opacity-80"
      >
        <Icon sf="minus" md="remove" size={26} color={value <= min ? colors.subtle : colors.text} />
      </Pressable>
      <View
        className="flex-row items-baseline gap-1.5"
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: `${formatted}${unit ? ` ${unit}` : ''}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => change(event.nativeEvent.actionName === 'increment' ? step : -step)}
      >
        <Text className="font-display text-[56px] leading-[60px] text-ink">{formatted}</Text>
        {unit ? <Text className="font-body text-base text-muted">{unit}</Text> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Aumentar ${label}`}
        disabled={value >= max}
        onPress={() => change(step)}
        className={`h-16 w-16 items-center justify-center rounded-[18px] active:opacity-80 ${value >= max ? 'bg-surface-2' : 'bg-accent'}`}
      >
        <Icon sf="plus" md="add" size={26} color={value >= max ? colors.subtle : colors.accentInk} />
      </Pressable>
    </View>
  );
}
