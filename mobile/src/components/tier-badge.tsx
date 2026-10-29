import { Text, View } from 'react-native';
import { tierGradient, tiers, type TierKey } from '@/constants/theme';

export function TierBadge({ tier, size = 48 }: { tier: TierKey; size?: number }) {
  return (
    <View
      accessibilityLabel={`Patente ${tiers[tier].label}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.29,
        alignItems: 'center',
        justifyContent: 'center',
        experimental_backgroundImage: tierGradient(tier)
      }}
    >
      <Text style={{ color: tiers[tier].ink, fontFamily: 'BarlowCondensed_700Bold', fontSize: size * 0.36 }}>
        {tiers[tier].label.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}
