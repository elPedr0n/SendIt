import { Pressable } from 'react-native';
import { Icon } from '@/components/icon';
import { colors } from '@/constants/theme';

const ICONS = {
  back: { sf: 'chevron.left', md: 'chevron-left' },
  close: { sf: 'xmark', md: 'close' }
} as const;

interface IconButtonProps {
  icon: keyof typeof ICONS;
  label: string;
  onPress: () => void;
}

export function IconButton({ icon, label, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      className="h-11 w-11 items-center justify-center rounded-full bg-surface active:opacity-80"
    >
      <Icon sf={ICONS[icon].sf} md={ICONS[icon].md} size={icon === 'back' ? 22 : 18} color={colors.textSoft} />
    </Pressable>
  );
}
