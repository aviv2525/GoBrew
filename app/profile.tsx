// app/profile.tsx
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { db } from '../lib/firebase';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // שליפת פרטי המשתמש
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const user = userSnap.data();
      setUserData(user);

      // אם המשתמש הוא מוכר – שלוף בקשות
      if (user.isSeller) {
        const q = query(
          collection(db, 'requests'),
          where('sellerId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        const snap = await getDocs(q);
        const requestList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestList);
      }
    };

    fetchUserAndRequests();
  }, []);

  if (!userData) return <Text>טוען...</Text>;
return (
  <ScrollView contentContainerStyle={{ padding: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>שלום, {userData.fullName}</Text>
    <Text>אימייל: {userData.email}</Text>

    {/* כפתור עריכת פרופיל – תמיד מופיע */}
    <View style={{ marginTop: 20 }}>
      <Button
        title="ערוך פרופיל"
        onPress={() => router.push('/edit-seller-profile')}
      />
    </View>

    {userData.isSeller && (
      <>
        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
          בקשות שהתקבלו:
        </Text>
        {requests.length === 0 ? (
          <Text>לא התקבלו עדיין בקשות</Text>
        ) : (
          requests.map((req) => (
            <View
              key={req.id}
              style={{
                marginVertical: 10,
                padding: 10,
                backgroundColor: '#f0f0f0',
                borderRadius: 10,
              }}
            >
              <Text>מאת: {req.senderName}</Text>
              <Text>הודעה: {req.message}</Text>
              <Text>
                תאריך: {new Date(req.timestamp.seconds * 1000).toLocaleString('he-IL')}
              </Text>
            </View>
          ))
        )}
      </>
    )}
  </ScrollView>
);
}