import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// דוגמאות של מוכרים
const sampleSellers = [
  {
    email: "pizzahut@example.com",
    displayName: "יוסי כהן",
    userType: "seller",
    businessName: "פיצה האט ירושלים",
    description: "פיצה איטלקית אמיתית בלב ירושלים. מגוון רחב של פיצות טריות ועסיסיות.",
    isActive: true,
    createdAt: new Date(),
  },
  {
    email: "sushi@example.com",
    displayName: "מיקי לוי",
    userType: "seller",
    businessName: "סושי טוקיו",
    description: "סושי יפני מקורי מהדגים הטריים ביותר. חוויה קולינרית יפנית אותנטית.",
    isActive: true,
    createdAt: new Date(),
  },
  {
    email: "burger@example.com",
    displayName: "דני אברהם",
    userType: "seller",
    businessName: "ברגר סטיישן",
    description: "המבורגרים הכי טעימים בעיר! בשר טרי וירקות טריים, מוגש עם תפוחי אדמה מושלמים.",
    isActive: true,
    createdAt: new Date(),
  },
  {
    email: "falafel@example.com",
    displayName: "אבי דוד",
    userType: "seller",
    businessName: "פלאפל המלך",
    description: "פלאפל כמו פעם! מתכון משפחתי עתיק עם חומוס ביתי ופיתה חמה.",
    isActive: true,
    createdAt: new Date(),
  },
];

export const seedSellers = async () => {
  try {
    console.log('Starting to seed sellers...');
    
    for (const seller of sampleSellers) {
      await addDoc(collection(db, 'users'), seller);
      console.log(`Added seller: ${seller.businessName}`);
    }
    
    console.log('Successfully seeded all sellers!');
  } catch (error) {
    console.error('Error seeding sellers:', error);
  }
};

// דוגמאות של קונים
const sampleBuyers = [
  {
    email: "buyer1@example.com",
    displayName: "שרה כהן",
    userType: "buyer",
    createdAt: new Date(),
  },
  {
    email: "buyer2@example.com",
    displayName: "משה לוי",
    userType: "buyer",
    createdAt: new Date(),
  },
];

export const seedBuyers = async () => {
  try {
    console.log('Starting to seed buyers...');
    
    for (const buyer of sampleBuyers) {
      await addDoc(collection(db, 'users'), buyer);
      console.log(`Added buyer: ${buyer.displayName}`);
    }
    
    console.log('Successfully seeded all buyers!');
  } catch (error) {
    console.error('Error seeding buyers:', error);
  }
};

export const seedAllData = async () => {
  await seedSellers();
  await seedBuyers();
};