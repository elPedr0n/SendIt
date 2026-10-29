import { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps extends PropsWithChildren {
  /** Fixo na parte de baixo (CTA ao alcance do polegar). */
  footer?: ReactNode;
  /** Telas dentro das tabs: a tab bar nativa já cuida do inset inferior. */
  inTabs?: boolean;
}

export function Screen({ children, footer, inTabs = false }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView className="flex-1 bg-bg" behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24, gap: 20 }}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
      >
        {children}
      </ScrollView>
      {footer ? (
        <View className="px-5 pt-3" style={{ paddingBottom: inTabs ? 12 : insets.bottom + 12 }}>
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}
