import { Text, View } from 'react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { PrimaryButton } from '@/components/primary-button';
import { SectionLabel } from '@/components/typography';
import { Icon } from '@/components/icon';
import { ErrorView, LoadingView } from '@/components/state-views';
import { colors } from '@/constants/theme';
import { useCurrentUser } from '@/hooks/use-user';

const WEEK_DAYS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

function todayLabel() {
  return new Date()
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' })
    .toUpperCase();
}

export default function TodayScreen() {
  const { data: user, isPending, error, refetch } = useCurrentUser();
  // Segunda = 0 … Domingo = 6
  const todayIndex = (new Date().getDay() + 6) % 7;

  if (isPending) return <Screen inTabs><LoadingView /></Screen>;
  if (error || !user) return <Screen inTabs><ErrorView message={error?.message ?? 'Usuário não encontrado'} onRetry={refetch} /></Screen>;

  return (
    <Screen
      inTabs
      footer={<PrimaryButton label="Iniciar treino" onPress={() => {}} disabled />}
    >
      <View className="gap-1">
        <Text className="font-body-medium text-xs tracking-[2.4px] text-muted">{todayLabel()}</Text>
        <Text accessibilityRole="header" className="font-body-semibold text-[22px] text-ink">
          Bora treinar, {user.name}
        </Text>
      </View>

      <Card className="items-center py-6">
        <SectionLabel>STREAK ATUAL</SectionLabel>
        <View className="flex-row items-center gap-3">
          <Icon sf="flame.fill" md="local-fire-department" size={40} color={user.currentStreak > 0 ? colors.accent : colors.subtle} />
          <Text className="font-display text-[88px] leading-[92px] text-ink">{user.currentStreak}</Text>
        </View>
        <Text className="font-body text-base text-muted">
          {user.currentStreak === 0 ? 'registre um treino para acender' : 'dias consecutivos'}
        </Text>
      </Card>

      <Card>
        <SectionLabel>META SEMANAL</SectionLabel>
        <Text className="font-display text-[34px] leading-[38px] text-ink">
          <Text className="text-accent">0</Text> de {user.weeklyGoal} treinos
        </Text>
        <View className="h-2 rounded-full bg-surface-2" />
        <View className="flex-row justify-between">
          {WEEK_DAYS.map((day, index) => (
            <View key={index} className="items-center gap-2">
              <Text className={`font-body-medium text-xs ${index === todayIndex ? 'text-ink' : 'text-muted'}`}>{day}</Text>
              <View className={`h-10 w-10 rounded-full border ${index === todayIndex ? 'border-accent' : 'border-line'}`} />
            </View>
          ))}
        </View>
      </Card>

      <Text className="text-center font-body text-[13px] text-muted">O registro de treinos chega na Sprint 2.</Text>
    </Screen>
  );
}
