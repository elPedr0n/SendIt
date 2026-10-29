import { Text, View } from 'react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { ScreenTitle, SectionLabel } from '@/components/typography';
import { colors } from '@/constants/theme';

export default function HistoryScreen() {
  return (
    <Screen inTabs>
      <View className="gap-1">
        <SectionLabel>ÚLTIMOS 30 DIAS</SectionLabel>
        <ScreenTitle>Histórico</ScreenTitle>
      </View>
      <Card className="items-center gap-3 py-10">
        <Icon sf="clock" md="history" size={36} color={colors.subtle} />
        <Text className="font-body-semibold text-lg text-ink">Nenhum treino ainda</Text>
        <Text className="text-center font-body text-[15px] leading-[21px] text-muted">
          Seus treinos aparecem aqui em ordem cronológica, com edição e exclusão. Chega na Sprint 3.
        </Text>
      </Card>
    </Screen>
  );
}
