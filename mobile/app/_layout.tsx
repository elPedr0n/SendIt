import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed/700Bold';
import { Outfit_400Regular } from '@expo-google-fonts/outfit/400Regular';
import { Outfit_500Medium } from '@expo-google-fonts/outfit/500Medium';
import { Outfit_600SemiBold } from '@expo-google-fonts/outfit/600SemiBold';
import { Outfit_700Bold } from '@expo-google-fonts/outfit/700Bold';
import { colors } from '@/constants/theme';
import { SessionProvider, useSession } from '@/providers/session-provider';
import { useCurrentUser } from '@/hooks/use-user';
import { ApiError } from '@/services/api';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // 4xx não melhora tentando de novo
      retry: (failureCount, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2
    }
  }
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BarlowCondensed_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { userId, signOut } = useSession();
  const user = useCurrentUser();

  // Banco resetado / usuário apagado: volta ao onboarding em vez de ficar preso em erro.
  useEffect(() => {
    if (user.error instanceof ApiError && user.error.status === 404) signOut();
  }, [user.error, signOut]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={!!userId}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="exercicios/index" />
        <Stack.Screen name="exercicios/novo" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!userId}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}
