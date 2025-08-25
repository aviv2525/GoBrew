import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../lib/firebase';



function mapAuthError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in (err as any)) {
    const code = (err as FirebaseError).code;
    switch (code) {
      case 'auth/invalid-email':
        return 'האימייל אינו תקין.';
      case 'auth/user-disabled':
        return 'המשתמש הושבת.';
      case 'auth/user-not-found':
        return 'המשתמש לא נמצא.';
      case 'auth/wrong-password':
      case 'auth/invalid-password':
      case 'auth/invalid-credential': // לעתים מגיע במקום wrong-password/user-not-found
        return 'אימייל או סיסמה שגויים.';
      case 'auth/too-many-requests':
        return 'נחסמו נסיונות רבים. נסה מאוחר יותר.';
      case 'auth/network-request-failed':
        return 'שגיאת רשת. בדוק חיבור לאינטרנט.';
      default:
        return 'לא ניתן להתחבר. נסה שוב.';
    }
  }
  return 'שגיאה לא צפויה.';
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errText, setErrText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrText('');
    const e = email.trim();

    // וולידציה בסיסית לפני Firebase
    if (!e) {
      const msg = 'אנא הזן אימייל.';
      setErrText(msg); Alert.alert('שגיאה', msg); return;
    }
    if (!password) {
      const msg = 'אנא הזן סיסמה.';
      setErrText(msg); Alert.alert('שגיאה', msg); return;
    }

    setLoading(true);
    Keyboard.dismiss();
    try {
      await signInWithEmailAndPassword(auth, e, password);
      router.replace('/users');
    } catch (error) {
      console.error('Login error:', error);
      const msg = mapAuthError(error);
      setErrText(msg);
      Alert.alert('שגיאה', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>כניסה</Text>

      <TextInput
        style={styles.input}
        placeholder="אימייל"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        secureTextEntry
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      {!!errText && <Text style={styles.error}>{errText}</Text>}

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>התחבר</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} disabled={loading}>
        <Text style={styles.link}>אין לך חשבון? הירשם כאן</Text>
      </TouchableOpacity>

      {/* אופציה לצפייה כאורח */}
      <TouchableOpacity onPress={() => router.push('/users')} disabled={loading} style={{ marginTop: 8 }}>
        <Text style={styles.link}>צפה ללא התחברות</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, marginBottom: 16, textAlign: 'center', fontWeight: '600' },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8, borderColor: '#C9C9C9' },
  button: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  link: { color: 'blue', marginTop: 16, textAlign: 'center' },
  error: { color: '#C62828', marginBottom: 8, textAlign: 'center' },
});

  

