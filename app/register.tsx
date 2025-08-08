// app/register.tsx
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../lib/firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | null>(null);

  const handleRegister = async () => {
    if (!role) {
      Alert.alert('בחר תפקיד', 'אנא בחר האם אתה לקוח או מוכר');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('שגיאה', 'הסיסמאות לא תואמות');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
      });

      if (role === 'seller') {
        router.replace('/complete-seller-profile');
      } else {
        router.replace('/(tabs)/users');
      }
    } catch (error: any) {
      Alert.alert('שגיאה', error.message);
    }
  };

  const handleNavigateToLogin = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הרשמה</Text>

      <TextInput
        style={styles.input}
        placeholder="אימייל"
        onChangeText={setEmail}
        autoCapitalize="none"
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="אימות סיסמה"
        onChangeText={setConfirmPassword}
        secureTextEntry
        value={confirmPassword}
      />

      <Text style={styles.label}>בחר סוג משתמש:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'buyer' && styles.selectedRole]}
          onPress={() => setRole('buyer')}
        >
          <Text style={styles.roleText}>לקוח</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'seller' && styles.selectedRole]}
          onPress={() => setRole('seller')}
        >
          <Text style={styles.roleText}>מוכר</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>צור חשבון</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigateToLogin} style={styles.loginLink}>
        <Text style={styles.loginText}>כבר יש לך חשבון? התחבר כאן</Text>
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
  label: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#eee',
  },
  selectedRole: {
    backgroundColor: '#4CAF50',
  },
  roleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});
