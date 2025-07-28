import { router } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { auth, db } from '../lib/firebase';

export default function CompleteSellerProfile() {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [machineType, setMachineType] = useState('');
  const [drinksOffered, setDrinksOffered] = useState('');
  const [openHours, setOpenHours] = useState('');

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('שגיאה', 'משתמש לא מחובר');
      return;
    }

    try {
    await setDoc(
    doc(db, 'users', user.uid),
    {
        fullName,
        address,
        machineType,
        drinksOffered: drinksOffered.split(',').map(s => s.trim()),
        openHours,
        // לא צריך שוב email או role — כבר נשמר
    },
    { merge: true }
);


      router.replace('/users');
    } catch (error: any) {
      Alert.alert('שגיאה בשמירה', error.message);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>השלמת פרטי מוכר</Text>

      <TextInput
        style={styles.input}
        placeholder="שם מלא"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="כתובת מלאה"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="סוג מכונת קפה"
        value={machineType}
        onChangeText={setMachineType}
      />
      <TextInput
        style={styles.input}
        placeholder="סוגי משקאות (מופרדים בפסיקים)"
        value={drinksOffered}
        onChangeText={setDrinksOffered}
      />
      <TextInput
        style={styles.input}
        placeholder="שעות פעילות (למשל: 08:00-20:00)"
        value={openHours}
        onChangeText={setOpenHours}
      />

      {/* נוכל להוסיף כאן תמונות וסרטונים בהמשך */}
      <Button title="שמור והמשך" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});
