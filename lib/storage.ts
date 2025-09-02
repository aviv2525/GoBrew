// app/lib/storage.ts
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const stor = getStorage(app);


// מעלה קובץ מ-URI מקומי (Expo) ומחזיר downloadURL
export async function uploadFileFromUri(localUri: string, pathPrefix: string) {
  const res = await fetch(localUri);
  const blob = await res.blob();
  const r = ref(storage, `${pathPrefix}/${Date.now()}.jpg`);
  await uploadBytes(r, blob);
  return await getDownloadURL(r);
}
