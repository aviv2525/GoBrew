// app/edit-seller-profile.tsx
import * as ImagePicker from 'expo-image-picker';
import * as VideoPicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { db, storage } from '../lib/firebase';

export default function EditSellerProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const docRef = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setUserData({ id: currentUser.uid, ...snap.data() });
      }
    };

    fetchUser();
  }, []);

  const uploadMedia = async (mediaUri: string, type: 'images' | 'videos') => {
    const blob = await fetch(mediaUri).then((res) => res.blob());
    const fileName = mediaUri.split('/').pop();
    const storageRef = ref(storage, `${type}/${userData.id}/${fileName}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleMediaUpload = async (mediaType: 'image' | 'video') => {
    const pickerFn =
      mediaType === 'image'
        ? ImagePicker.launchImageLibraryAsync
        : VideoPicker.launchImageLibraryAsync;

    const result = await pickerFn({
      mediaTypes:
        mediaType === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const url = await uploadMedia(result.assets[0].uri, mediaType === 'image' ? 'images' : 'videos');
      setUserData((prev: any) => ({
        ...prev,
        [mediaType === 'image' ? 'images' : 'videos']: [
          ...(prev[mediaType === 'image' ? 'images' : 'videos'] || []),
          url,
        ],
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', userData.id);
      await updateDoc(docRef, {
        fullName: userData.fullName,
        address: userData.address,
        machineType: userData.machineType,
        openHours: userData.openHours,
        drinksOffered: userData.drinksOffered,
        images: userData.images || [],
        videos: userData.videos || [],
      });
      Alert.alert('נשמר בהצלחה');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <Text>טוען פרופיל...</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>עריכת פרופיל</Text>

      <Text>שם מלא:</Text>
      <TextInput
        value={userData.fullName}
        onChangeText={(text) => setUserData({ ...userData, fullName: text })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>כתובת:</Text>
      <TextInput
        value={userData.address}
        onChangeText={(text) => setUserData({ ...userData, address: text })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>סוג מכונה:</Text>
      <TextInput
        value={userData.machineType}
        onChangeText={(text) => setUserData({ ...userData, machineType: text })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>שעות פתיחה:</Text>
      <TextInput
        value={userData.openHours}
        onChangeText={(text) => setUserData({ ...userData, openHours: text })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>משקאות מוצעים (מופרדים בפסיק):</Text>
      <TextInput
        value={userData.drinksOffered?.join(', ')}
        onChangeText={(text) =>
          setUserData({ ...userData, drinksOffered: text.split(',').map(s => s.trim()) })
        }
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text style={{ marginTop: 10 }}>תמונות:</Text>
      <ScrollView horizontal>
        {userData.images?.map((uri: string, index: number) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 100, height: 100, marginRight: 10, borderRadius: 10 }}
          />
        ))}
      </ScrollView>
      <Button title="הוסף תמונה" onPress={() => handleMediaUpload('image')} />

      <Text style={{ marginTop: 10 }}>סרטונים:</Text>
      <ScrollView horizontal>
        {userData.videos?.map((uri: string, index: number) => (
          <Text key={index} style={{ marginRight: 10 }}>
            🎬 {uri.split('/').pop()}
          </Text>
        ))}
      </ScrollView>
      <Button title="הוסף סרטון" onPress={() => handleMediaUpload('video')} />

      <View style={{ marginTop: 20 }}>
        <Button title={loading ? 'שומר...' : 'שמור שינויים'} onPress={handleSave} disabled={loading} />
      </View>
    </ScrollView>
  );
}
