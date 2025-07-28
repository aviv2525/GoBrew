# אפליקציית GoBrew - דומה ל-Wolt

אפליקציית React Native שמחברת בין מוכרים וקונים, בדומה לאפליקציית Wolt.

## תכונות

- **אותנטיקציה**: התחברות והרשמה עם Firebase Auth
- **סוגי משתמשים**: מוכרים וקונים
- **רשימת מוכרים**: הצגת כל המוכרים הפעילים
- **פרופיל משתמש**: הצגת פרטים אישיים ואפשרות יציאה
- **הזמנות**: מסך להזמנות (בהמשך)

## התקנה והגדרה

### 1. התקנת תלויות

התלויות כבר מותקנות, אבל אם יש צורך:

```bash
npm install
```

### 2. הגדרת Firebase

1. צור פרויקט חדש ב-[Firebase Console](https://console.firebase.google.com/)
2. הפעל Authentication ו-Firestore
3. בקובץ `config/firebase.ts`, החלף את הערכים ב-`firebaseConfig` עם ההגדרות של הפרויקט שלך:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. הגדרת Firestore Rules

ב-Firebase Console, עבור ל-Firestore Database > Rules והגדר:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // משתמשים יכולים לקרוא ולכתוב רק את המסמכים שלהם
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // כולם יכולים לקרוא מוכרים פעילים
    match /users/{userId} {
      allow read: if request.auth != null && 
                      resource.data.userType == 'seller' && 
                      resource.data.isActive == true;
    }
    
    // הזמנות - רק המשתמש שיצר או המוכר יכולים לגשת
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
                           (request.auth.uid == resource.data.buyerId || 
                            request.auth.uid == resource.data.sellerId);
    }
  }
}
```

### 4. הרצת האפליקציה

```bash
# להרצה במכשיר אנדרואיד
npm run android

# להרצה ב-iOS Simulator
npm run ios

# להרצה בדפדפן
npm run web
```

## מבנה הפרויקט

```
├── app/
│   ├── (tabs)/           # מסכי הטאבים
│   │   ├── index.tsx     # מסך הבית - רשימת מוכרים
│   │   ├── explore.tsx   # מסך הזמנות
│   │   └── profile.tsx   # מסך פרופיל
│   ├── auth/
│   │   └── login.tsx     # מסך התחברות/הרשמה
│   └── _layout.tsx       # Layout ראשי עם בדיקת אותנטיקציה
├── components/
│   └── SellerCard.tsx    # קומפוננט כרטיס מוכר
├── hooks/
│   ├── useAuth.ts        # Hook לאותנטיקציה
│   └── useSellers.ts     # Hook לשליפת מוכרים
├── types/
│   └── index.ts          # הגדרות טיפוסים
├── config/
│   └── firebase.ts       # הגדרות Firebase
└── scripts/
    └── seedData.ts       # נתונים לדוגמה (אופציונלי)
```

## שימוש

### הרשמה/התחברות
1. פתח את האפליקציה
2. תועבר למסך ההרשמה/התחברות
3. הירשם כקונה או מוכר
4. אם בחרת מוכר, הזן גם שם עסק

### צפייה במוכרים
- במסך הבית תוכל לראות רשימה של כל המוכרים הפעילים
- לחץ על מוכר כדי לבצע הזמנה (בשלב זה רק התראה)

### פרופיל
- במסך הפרופיל תוכל לראות את הפרטים שלך
- אפשרות ליציאה מהמערכת

## פיתוח עתידי

- [ ] מסך הזמנה מפורט
- [ ] עגלת קניות
- [ ] מעקב אחר הזמנות
- [ ] מערכת הודעות
- [ ] דירוגים וביקורות
- [ ] מפה ומיקום
- [ ] תשלומים

## תמיכה

אם יש בעיות או שאלות, ניתן ליצור Issue בריפוזיטורי או לפנות למפתח.