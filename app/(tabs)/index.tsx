import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../lib/firebase';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/users'); // או כל מסך שתבחר
    } catch (error: any) {
      Alert.alert('שגיאה', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>כניסה</Text>
      <TextInput
        style={styles.input}
        placeholder="אימייל"
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>התחבר</Text>
      </TouchableOpacity>
    
      <TouchableOpacity onPress={() => router.push('/register')}>
      <Text style={{ color: 'blue', marginTop: 16, textAlign: 'center' }}>
      אין לך חשבון? הירשם כאן
      </Text>
      </TouchableOpacity>

    </View>
  
);

  
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 8 },
  button: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});