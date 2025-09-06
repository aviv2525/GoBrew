import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();


  return (
    <View>
      <Text>Explore Page</Text>
      <Button
        title="עבור למשתמשים"
        onPress={() => router.push('/users')}
      
      />
    </View>
  );
}
