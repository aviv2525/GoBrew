import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../lib/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.data();

      if (!userDoc.exists() || !data?.role) {
        router.replace('/complete-profile');
        return;
      }

      router.replace('/(tabs)/users');
    } catch (error: any) {
      Alert.alert('שגיאה בהתחברות', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התחברות</Text>
      <TextInput
        style={styles.input}
        placeholder="אימייל"
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'מתחבר...' : 'התחבר'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigateToRegister} style={styles.registerLink}>
        <Text style={styles.registerText}>אין לך חשבון? הירשם כאן</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: { backgroundColor: '#2e86de', padding: 14, borderRadius: 8 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { color: '#2e86de', textDecorationLine: 'underline' },
});