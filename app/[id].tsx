// app/users/[id].tsx

import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../lib/firebase';



export default function SellerProfileScreen() {
  const { id: sellerId } = useLocalSearchParams();
  const currentUser = auth.currentUser;
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedDrink, setSelectedDrink] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  //const [sellerID ,drinksOffered,] = useState<any[]>([]);  

const router = useRouter();

  // שליפת פרטי המוכר
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const docRef = doc(db, "users", sellerId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSeller({ id: docSnap.id, ...docSnap.data() });
        } else {
          Alert.alert("שגיאה", "משתמש לא נמצא");
        }
      } catch (err) {
        console.error("Error fetching seller:", err);
      } finally {
        setLoading(false);
      }
    };
    if (sellerId) fetchSeller();
  }, [sellerId]);

  // אם אני המוכר — האזנה להזמנות
  useEffect(() => {
    if (currentUser?.uid === sellerId) {
      const q = query(
        collection(db, "orders"),
        where("sellerId", "==", sellerId),
        where("status", "==", "pending")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(newOrders);
      });
      return unsubscribe;
    }
  }, [sellerId]);


  
  // יצירת הזמנה
   const createOrder = async () => {
    try {
      if (!currentUser) {
        Alert.alert("אנא התחבר תחילה");
        return;
      }
      await addDoc(collection(db, "orders"), {
        buyerId: currentUser.uid,
        buyerName: currentUser.displayName || "לקוח",
        drinkType: selectedDrink || "לא נבחר משקה",
        notes: orderNotes || "אין הערות",
        sellerId: sellerId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      Alert.alert("הזמנה נשלחה", "המוכר יקבל התראה");
      setSelectedDrink("");
      setOrderNotes("");
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  // סימון כהוגש
  const markAsServed = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "served" });
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!seller) return <Text>לא נמצא מוכר</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{seller.fullName}</Text>
      <Text>{seller.description}</Text>
      <Text>סוג מכונה: {seller.machineType}</Text>
      <Text>משקאות: {seller.drinks?.join(", ")}</Text>

      {currentUser?.uid !== sellerId && (
        <>
          {/* בחירת משקה */}
          <Text style={{ marginTop: 20, fontSize: 16 }}>בחר משקה:</Text>
          <Picker
            selectedValue={selectedDrink}
            onValueChange={(itemValue) => setSelectedDrink(itemValue)}
            style={{ backgroundColor: "#f0f0f0", marginTop: 8 }}
          >
            <Picker.Item label="בחר משקה" value="" />
            {seller.drinks?.map((drink: string, index: number) => (
              <Picker.Item key={index} label={drink} value={drink} />
            ))}
          </Picker>

          {/* הערות להזמנה */}
          <Text style={{ marginTop: 20, fontSize: 16 }}>הערות להזמנה:</Text>
          <TextInput
            placeholder="לדוגמה: פחות סוכר, חלב שקדים..."
            value={orderNotes}
            onChangeText={setOrderNotes}
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 8,
              marginTop: 8,
            }}
          />

          {/* כפתור הזמנה */}
          <TouchableOpacity
            onPress={createOrder}
            style={{
              marginTop: 20,
              backgroundColor: "#4CAF50",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              שלח הזמנה
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

