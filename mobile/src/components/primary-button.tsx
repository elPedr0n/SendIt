import { ActivityIndicator, Pressable, Text } from 'react-native';
import { colors } from '@/constants/theme';
import { haptics } from '@/lib/haptics';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({ label, onPress, disabled = false, loading = false }: PrimaryButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        haptics.press();
        onPress();
      }}
      className={`h-[60px] items-center justify-center rounded-button active:opacity-85 ${inactive ? 'bg-surface-2' : 'bg-accent'}`}
    >
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <Text className={`font-display text-[22px] tracking-[1.5px] ${inactive ? 'text-subtle' : 'text-accent-ink'}`}>
          {label.toUpperCase()}
        </Text>
      )}
    </Pressable>
  );
}
