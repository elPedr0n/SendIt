import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/screen';
import { Chip } from '@/components/chip';
import { IconButton } from '@/components/icon-button';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenTitle, SectionLabel } from '@/components/typography';
import { colors } from '@/constants/theme';
import { EXERCISE_CATEGORIES, TRACKING_TYPES, type ExerciseCategory, type TrackingType } from '@/constants/exercise';
import { useCreateExercise } from '@/hooks/use-exercises';
import { ApiError } from '@/services/api';
import { haptics } from '@/lib/haptics';

export default function NewExerciseScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | null>(null);
  const [trackingType, setTrackingType] = useState<TrackingType>('reps_weight');
  const createExercise = useCreateExercise();

  const canSubmit = name.trim().length > 0 && category !== null;

  const submit = () => {
    if (!category) return;
    createExercise.mutate(
      { name: name.trim(), category, trackingType },
      {
        onSuccess: () => {
          haptics.success();
          router.back();
        },
        onError: () => haptics.error()
      }
    );
  };

  const errorMessage =
    createExercise.error instanceof ApiError && createExercise.error.status === 409
      ? 'Já existe um exercício com esse nome.'
      : createExercise.error?.message;

  return (
    <Screen
      footer={
        <View className="gap-3">
          {errorMessage ? (
            <Text accessibilityLiveRegion="polite" className="text-center font-body text-sm text-danger">
              {errorMessage}
            </Text>
          ) : null}
          <PrimaryButton label="Criar exercício" onPress={submit} disabled={!canSubmit} loading={createExercise.isPending} />
        </View>
      }
    >
      <View className="flex-row items-center justify-between">
        <IconButton icon="close" label="Fechar" onPress={() => router.back()} />
        <SectionLabel>PERSONALIZADO</SectionLabel>
        <View className="w-11" />
      </View>

      <ScreenTitle>Novo exercício</ScreenTitle>

      <View className="gap-2">
        <SectionLabel>NOME</SectionLabel>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex.: Leg press 45°"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Nome do exercício"
          autoCapitalize="sentences"
          maxLength={60}
          className="h-[54px] rounded-2xl bg-surface px-4 font-body-semibold text-[17px] text-ink"
        />
      </View>

      <View className="gap-2.5">
        <SectionLabel>CATEGORIA</SectionLabel>
        <View className="flex-row flex-wrap gap-2">
          {EXERCISE_CATEGORIES.map((option) => (
            <Chip key={option} label={option} selected={category === option} onPress={() => setCategory(option)} />
          ))}
        </View>
      </View>

      <View className="gap-2.5">
        <SectionLabel>COMO REGISTRAR</SectionLabel>
        <View className="gap-2" accessibilityRole="radiogroup">
          {TRACKING_TYPES.map((type) => {
            const selected = type.id === trackingType;
            return (
              <Pressable
                key={type.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  haptics.tap();
                  setTrackingType(type.id);
                }}
                className={`min-h-[68px] flex-row items-center gap-3 rounded-[18px] border-[1.5px] px-4 py-3 active:opacity-85 ${selected ? 'border-accent bg-accent-tint' : 'border-transparent bg-surface'}`}
              >
                <View className="flex-1 gap-0.5">
                  <Text className="font-body-semibold text-base text-ink">{type.label}</Text>
                  <Text className="font-body text-[13px] text-muted">{type.hint}</Text>
                </View>
                <View className={`h-[22px] w-[22px] rounded-full ${selected ? 'border-[7px] border-accent bg-bg' : 'border-2 border-subtle'}`} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
