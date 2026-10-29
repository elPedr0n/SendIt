import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Screen } from '@/components/screen';
import { Chip } from '@/components/chip';
import { Icon } from '@/components/icon';
import { IconButton } from '@/components/icon-button';
import { ScreenTitle, SectionLabel } from '@/components/typography';
import { ErrorView, LoadingView } from '@/components/state-views';
import { colors } from '@/constants/theme';
import { EXERCISE_CATEGORIES, trackingTypeLabel, type ExerciseCategory } from '@/constants/exercise';
import { useExercises } from '@/hooks/use-exercises';
import type { Exercise } from '@/types/api';

type Filter = 'Todos' | ExerciseCategory;

// Busca sem acento/caixa: "supino" encontra "Supino", "bracos" encontra "Braços".
const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function ExercisesScreen() {
  const { data, isPending, error, refetch } = useExercises();
  const [filter, setFilter] = useState<Filter>('Todos');
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = normalize(query.trim());
    const visible = (data ?? []).filter(
      (exercise) => (filter === 'Todos' || exercise.category === filter) && (!q || normalize(exercise.name).includes(q))
    );
    return EXERCISE_CATEGORIES.map((category) => ({
      category,
      items: visible.filter((exercise) => exercise.category === category).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    })).filter((group) => group.items.length > 0);
  }, [data, filter, query]);

  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <IconButton icon="back" label="Voltar" onPress={() => router.back()} />
        <Link href="/exercicios/novo" asChild>
          <Pressable accessibilityRole="button" className="h-11 flex-row items-center gap-1.5 rounded-full bg-accent pl-3 pr-4 active:opacity-85">
            <Icon sf="plus" md="add" size={18} color={colors.accentInk} />
            <Text className="font-body-bold text-[15px] text-accent-ink">Novo</Text>
          </Pressable>
        </Link>
      </View>

      <ScreenTitle>Exercícios</ScreenTitle>

      <View className="h-[50px] flex-row items-center gap-2.5 rounded-2xl bg-surface px-3.5">
        <Icon sf="magnifyingglass" md="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar exercício"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Buscar exercício"
          returnKeyType="search"
          autoCorrect={false}
          className="flex-1 font-body text-base text-ink"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }} style={{ marginRight: -20 }}>
        {(['Todos', ...EXERCISE_CATEGORIES] as Filter[]).map((option) => (
          <Chip key={option} label={option} selected={filter === option} onPress={() => setFilter(option)} />
        ))}
      </ScrollView>

      {isPending ? <LoadingView /> : null}
      {error ? <ErrorView message={error.message} onRetry={refetch} /> : null}
      {data && groups.length === 0 ? (
        <Text className="py-8 text-center font-body text-[15px] text-muted">Nenhum exercício encontrado.</Text>
      ) : null}

      {groups.map((group) => (
        <View key={group.category} className="gap-2">
          <SectionLabel>{group.category.toUpperCase()}</SectionLabel>
          <View className="rounded-card bg-surface">
            {group.items.map((exercise, index) => (
              <ExerciseRow key={exercise.id} exercise={exercise} divider={index > 0} />
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}

function ExerciseRow({ exercise, divider }: { exercise: Exercise; divider: boolean }) {
  return (
    <View>
      {divider ? <View className="ml-4 h-px bg-surface-2" /> : null}
      <View className="min-h-16 justify-center gap-0.5 px-4 py-2.5">
        <Text className="font-body-semibold text-base text-ink">{exercise.name}</Text>
        <Text className="font-body text-[13px] text-muted">
          {exercise.isCustom ? <Text className="text-accent-soft">Personalizado · </Text> : null}
          {trackingTypeLabel(exercise.trackingType)}
        </Text>
      </View>
    </View>
  );
}
