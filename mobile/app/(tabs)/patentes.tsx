import { Text, View } from 'react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { TierBadge } from '@/components/tier-badge';
import { ScreenTitle, SectionLabel } from '@/components/typography';
import { TIER_ORDER, tiers } from '@/constants/theme';

export default function RanksScreen() {
  return (
    <Screen inTabs>
      <View className="gap-1">
        <SectionLabel>PROGRESSÃO POR EXERCÍCIO</SectionLabel>
        <ScreenTitle>Patentes</ScreenTitle>
      </View>

      <Card>
        <Text className="font-body-semibold text-lg text-ink">Suba de patente levantando mais</Text>
        <Text className="font-body text-[15px] leading-[21px] text-muted">
          Supino, agachamento, terra e barra fixa ganham patente pelo seu 1RM estimado. As patentes chegam na Sprint 5.
        </Text>
      </Card>

      <View className="gap-2">
        <SectionLabel>ESCALA DE TIERS</SectionLabel>
        <View className="flex-row flex-wrap gap-2.5">
          {TIER_ORDER.map((key, index) => (
            <View key={key} className="w-[48%] flex-row items-center gap-3 rounded-card bg-surface p-3">
              <TierBadge tier={key} size={44} />
              <View>
                <Text className="font-body-bold text-base" style={{ color: tiers[key].text }}>
                  {tiers[key].label}
                </Text>
                <Text className="font-body text-xs text-muted">nível {index + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
