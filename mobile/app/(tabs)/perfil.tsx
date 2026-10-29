import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { Stepper } from '@/components/stepper';
import { GoalPicker, goalLabel } from '@/components/goal-picker';
import { PrimaryButton } from '@/components/primary-button';
import { SectionLabel } from '@/components/typography';
import { Icon } from '@/components/icon';
import { ErrorView, LoadingView } from '@/components/state-views';
import { colors } from '@/constants/theme';
import { useCurrentUser, useUpdateUser } from '@/hooks/use-user';
import { useExercises } from '@/hooks/use-exercises';
import { useSession } from '@/providers/session-provider';
import { haptics } from '@/lib/haptics';

const DEFAULT_WEIGHT = 75;

export default function ProfileScreen() {
  const { data: user, isPending, error, refetch } = useCurrentUser();
  const exercises = useExercises();
  const updateUser = useUpdateUser();
  const { signOut } = useSession();

  const [weight, setWeight] = useState(DEFAULT_WEIGHT);
  const [goal, setGoal] = useState(4);

  // Sincroniza o rascunho quando o usuário carrega ou é salvo.
  useEffect(() => {
    if (!user) return;
    setWeight(user.bodyweightKg ?? DEFAULT_WEIGHT);
    setGoal(user.weeklyGoal);
  }, [user]);

  if (isPending) return <Screen inTabs><LoadingView /></Screen>;
  if (error || !user) return <Screen inTabs><ErrorView message={error?.message ?? 'Usuário não encontrado'} onRetry={refetch} /></Screen>;

  const dirty = weight !== (user.bodyweightKg ?? DEFAULT_WEIGHT) || goal !== user.weeklyGoal;

  const save = () =>
    updateUser.mutate(
      { bodyweightKg: weight, weeklyGoal: goal },
      { onSuccess: () => haptics.success(), onError: () => haptics.error() }
    );

  const confirmReset = () =>
    Alert.alert('Recomeçar?', 'Você volta para o onboarding neste aparelho. Os dados no servidor não são apagados.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Recomeçar', style: 'destructive', onPress: signOut }
    ]);

  return (
    <Screen
      inTabs
      footer={dirty ? <PrimaryButton label="Salvar alterações" onPress={save} loading={updateUser.isPending} /> : undefined}
    >
      <View className="flex-row items-center gap-3.5 pt-1">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-accent-tint" accessibilityElementsHidden>
          <Text className="font-display text-[30px] text-accent">{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View className="flex-1 gap-0.5">
          <Text accessibilityRole="header" className="font-display text-[34px] leading-[38px] text-ink" numberOfLines={1}>
            {user.name}
          </Text>
          <Text className="font-body text-[13px] text-muted">
            Streak atual: {user.currentStreak} {user.currentStreak === 1 ? 'dia' : 'dias'}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <SectionLabel>CORPO & META</SectionLabel>
        <Card>
          <Text className="font-body text-base text-ink">Peso corporal</Text>
          <Stepper label="peso corporal" value={weight} onChange={setWeight} step={0.5} min={30} max={300} unit="kg" decimals={1} />
        </Card>
        <Card>
          <View className="flex-row items-baseline justify-between">
            <Text className="font-body text-base text-ink">Meta semanal</Text>
            <Text className="font-body-semibold text-sm text-ink-soft">{goalLabel(goal)}</Text>
          </View>
          <GoalPicker value={goal} onChange={setGoal} />
        </Card>
        {updateUser.error ? <Text className="font-body text-sm text-danger">{updateUser.error.message}</Text> : null}
      </View>

      <View className="gap-2">
        <SectionLabel>TREINO</SectionLabel>
        <View className="rounded-card bg-surface">
          <Link href="/exercicios" asChild>
            <Pressable accessibilityRole="link" className="min-h-14 flex-row items-center gap-3 px-4 active:opacity-80">
              <Text className="flex-1 font-body text-base text-ink">Exercícios</Text>
              <Text className="font-body-semibold text-base text-ink-soft">{exercises.data?.length ?? '–'}</Text>
              <Icon sf="chevron.right" md="chevron-right" size={16} color={colors.subtle} />
            </Pressable>
          </Link>
        </View>
      </View>

      <Pressable accessibilityRole="button" onPress={confirmReset} className="items-center py-3 active:opacity-70">
        <Text className="font-body-semibold text-[15px] text-muted">Recomeçar onboarding</Text>
      </Pressable>
    </Screen>
  );
}
