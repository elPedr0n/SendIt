import { PropsWithChildren } from 'react';
import { Text } from 'react-native';

export function SectionLabel({ children }: PropsWithChildren) {
  return <Text className="font-body-medium text-[11px] tracking-[2.4px] text-muted">{children}</Text>;
}

export function ScreenTitle({ children }: PropsWithChildren) {
  return (
    <Text accessibilityRole="header" className="font-display text-[44px] leading-[46px] text-ink">
      {children}
    </Text>
  );
}
