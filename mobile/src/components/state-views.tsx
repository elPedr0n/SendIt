import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export function LoadingView() {
  return (
    <View className="items-center py-10">
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View className="items-center gap-3 rounded-card bg-surface px-5 py-6">
      <Text className="text-center font-body text-[15px] leading-[21px] text-ink-soft">{message}</Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry} className="h-11 justify-center rounded-full bg-surface-2 px-5 active:opacity-80">
          <Text className="font-body-semibold text-[15px] text-ink">Tentar de novo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
