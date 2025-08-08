// app/_layout.tsx
import { Slot, Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'התחברות' }} />
      <Stack.Screen name="register" options={{ title: 'הרשמה' }} />
      <Stack.Screen name="complete-profile" options={{ title: 'השלמת פרופיל' }} />
      <Stack.Screen name="complete-seller-profile" options={{ title: 'פרטי מוכר' }} />
    </Stack>
  );
}
