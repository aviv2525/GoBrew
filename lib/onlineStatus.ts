import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/** מסמן את המשתמש הנוכחי כ-online/false + מעדכן lastSeen */
export async function setOnlineStatus(isOnline: boolean) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await setDoc(
    doc(db, "users", uid),
    { online: isOnline, lastSeen: serverTimestamp() },
    { merge: true } // יוצר אם לא קיים, מעדכן אם קיים
  );
}
