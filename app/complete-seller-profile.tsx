import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { Alert, Button, GestureResponderEvent, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { auth, db, storage } from '../lib/firebase';




export default function CompleteSellerProfile() {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [machineType, setMachineType] = useState('');
  const [drinksOffered, setDrinksOffered] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });


  const handlePickVideo = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const fileRef = ref(storage, `users/${user.uid}/videos/${Date.now()}`);
      await uploadBytes(fileRef, blob);

      const downloadUrl = await getDownloadURL(fileRef);
      await updateDoc(doc(db, 'users', user.uid), {
        videos: arrayUnion(downloadUrl),
      });

      Alert.alert('סרטון הועלה');
    }
  };

  if (!result.canceled) {
    const imageUri = result.assets[0].uri;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('שגיאה', 'משתמש לא מחובר');
      return;
    }

    const imageRef = ref(storage, `users/${user.uid}/profile-image.jpg`);
    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);
    //setImageUri(downloadURL); // להצגה באפליקציה
    setImages([downloadURL]); // מערך יחיד

    Alert.alert('הצלחה', 'התמונה נשמרה בהצלחה');
  }
};



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
        images,
        videos 
    },
    { merge: true }
);
      Alert.alert('הצלחה', 'הפרופיל נשמר בהצלחה');
      router.replace('/users');
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה בשמירה');
    }
  };


  function handlePickImage(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

  function handlePickVideo(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>שם מלא:</Text>
      <TextInput value={fullName} onChangeText={setFullName} placeholder="שם מלא" />
      <Text>כתובת:</Text>
      <TextInput value={address} onChangeText={setAddress} placeholder="כתובת" />
      <Text>סוג מכונה:</Text>
      <TextInput value={machineType} onChangeText={setMachineType} placeholder="סוג מכונת קפה" />
      <Text>סוגי משקאות (מופרדים בפסיקים):</Text>
      <TextInput value={drinksOffered} onChangeText={setDrinksOffered} placeholder="קפה קר, אספרסו,..." />
      <Text>שעות פעילות:</Text>
      <TextInput value={openHours} onChangeText={setOpenHours} placeholder="למשל 8:00 - 12:00" />

      <Button title="שמור פרופיל" onPress={handleSave} />
      <Button title="הוסף תמונה" onPress={handlePickImage} />
      <Button title="הוסף סרטון" onPress={handlePickVideo} />
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
