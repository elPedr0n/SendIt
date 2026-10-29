import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { colors } from '@/constants/theme';

type MaterialName = React.ComponentProps<typeof MaterialIcons>['name'];

interface IconProps {
  /** SF Symbol (iOS) */
  sf: SFSymbol;
  /** Material Icon (Android/web) — SF Symbols não renderizam fora do iOS */
  md: MaterialName;
  size?: number;
  color?: string;
}

export function Icon({ sf, md, size = 22, color = colors.text }: IconProps) {
  if (process.env.EXPO_OS === 'ios') {
    return <SymbolView name={sf} tintColor={color} weight="semibold" style={{ width: size, height: size }} />;
  }
  return <MaterialIcons name={md} size={size} color={color} />;
}
