import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GoBrew</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>התחברות</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
        <Text style={styles.secondaryButtonText}>הרשמה</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  button: { backgroundColor: '#2e86de', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, marginBottom: 12, alignSelf: 'stretch', marginHorizontal: 24 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  secondaryButton: { borderColor: '#2e86de', borderWidth: 2, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, alignSelf: 'stretch', marginHorizontal: 24 },
  secondaryButtonText: { color: '#2e86de', textAlign: 'center', fontWeight: 'bold' },
});