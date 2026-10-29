import { PropsWithChildren } from 'react';
import { View } from 'react-native';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <View className={`gap-3 rounded-card bg-surface px-[18px] py-4 ${className}`}>{children}</View>;
}
