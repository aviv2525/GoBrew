// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'כניסה' }} />
      <Tabs.Screen name="users" options={{ title: 'משתמשים' }} />
      <Tabs.Screen name="explore" options={{ title: 'חיפוש' }} />
      <Tabs.Screen name="profile" options={{ title: 'הפרופיל שלי' }} />
    </Tabs>
  );
}
