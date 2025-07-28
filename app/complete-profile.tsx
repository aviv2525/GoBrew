import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../lib/firebase';

export default function CompleteProfile() {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null);

  const handleContinue = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('שגיאה', 'לא נמצא משתמש מחובר');
      return;
    }

    if (!selectedRole) {
      Alert.alert('שגיאה', 'בחר תפקיד קודם');
      return;
    }

    const userData = {
      email: user.email,
      role: selectedRole,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userData);

      if (selectedRole === 'seller') {
        router.replace('/complete-seller-profile');
      } else {
        router.replace('/users');
      }
    } catch (err) {
      Alert.alert('שגיאה בשמירה', String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מה התפקיד שלך באפליקציה?</Text>

      <TouchableOpacity
        style={[
          styles.option,
          selectedRole === 'buyer' && styles.selected,
        ]}
        onPress={() => setSelectedRole('buyer')}
      >
        <Text style={styles.optionText}>אני לקוח</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          selectedRole === 'seller' && styles.selected,
        ]}
        onPress={() => setSelectedRole('seller')}
      >
        <Text style={styles.optionText}>אני מוכר</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>המשך</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  option: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  selected: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  optionText: {
    fontSize: 18,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  continueText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
