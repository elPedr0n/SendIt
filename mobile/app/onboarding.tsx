import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { Stepper } from '@/components/stepper';
import { GoalPicker, goalLabel } from '@/components/goal-picker';
import { PrimaryButton } from '@/components/primary-button';
import { SectionLabel } from '@/components/typography';
import { colors } from '@/constants/theme';
import { useCreateUser } from '@/hooks/use-user';
import { useSession } from '@/providers/session-provider';
import { haptics } from '@/lib/haptics';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(75);
  const [goal, setGoal] = useState(4);
  const createUser = useCreateUser();
  const { signIn } = useSession();

  const submit = () => {
    createUser.mutate(
      { name: name.trim(), bodyweightKg: weight, weeklyGoal: goal },
      {
        onSuccess: (user) => {
          haptics.success();
          // O guard do layout raiz troca para as tabs ao ter sessão.
          signIn(user.id);
        },
        onError: () => haptics.error()
      }
    );
  };

  return (
    <Screen
      footer={
        <View className="gap-3">
          {createUser.error ? (
            <Text accessibilityLiveRegion="polite" className="text-center font-body text-sm text-danger">
              {createUser.error.message}
            </Text>
          ) : null}
          <PrimaryButton label="Começar" onPress={submit} disabled={!name.trim()} loading={createUser.isPending} />
        </View>
      }
    >
      <View className="gap-2.5 pt-6">
        <Text className="font-display text-lg tracking-[4px] text-accent">SENDIT</Text>
        <Text accessibilityRole="header" className="font-display text-[44px] leading-[46px] text-ink">
          Bora começar.
        </Text>
        <Text className="font-body text-[15px] leading-[22px] text-muted">Três dados e você já registra o primeiro treino.</Text>
      </View>

      <Card>
        <SectionLabel>COMO QUER SER CHAMADO?</SectionLabel>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={colors.subtle}
          accessibilityLabel="Nome"
          autoCapitalize="words"
          autoComplete="given-name"
          returnKeyType="done"
          maxLength={60}
          className="h-[52px] rounded-control bg-surface-2 px-4 font-body-semibold text-lg text-ink"
        />
      </Card>

      <Card>
        <View className="flex-row items-baseline justify-between">
          <SectionLabel>PESO CORPORAL</SectionLabel>
          <Text className="font-body text-xs text-muted">usado nas patentes</Text>
        </View>
        <Stepper label="peso corporal" value={weight} onChange={setWeight} step={0.5} min={30} max={300} unit="kg" decimals={1} />
      </Card>

      <Card>
        <SectionLabel>META SEMANAL</SectionLabel>
        <GoalPicker value={goal} onChange={setGoal} />
        <Text className="font-body text-[13px] leading-[19px] text-muted">
          <Text className="font-body-semibold text-ink">{goalLabel(goal)}</Text> — bateu a meta, o streak não quebra. Dias de
          descanso também protegem a sequência.
        </Text>
      </Card>
    </Screen>
  );
}
