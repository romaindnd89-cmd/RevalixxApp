
// @ts-ignore
import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

// Configuration Revalixx Web
const firebaseConfig = {
  apiKey: "AIzaSyCOA4Z3C6raeR1sfJ9HRwuV2i1AtrA9Bn0",
  authDomain: "revalixx-web.firebaseapp.com",
  projectId: "revalixx-web",
  storageBucket: "revalixx-web.firebasestorage.app",
  messagingSenderId: "374358793357",
  appId: "1:374358793357:web:1f3f6888e9b83183cd96c4",
  measurementId: "G-C1K2JLSKR1"
};

let app;
let db: any;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const getDb = () => db;

// --- GESTION GALERIE ---

export const addImageToDb = async (url: string, caption: string) => {
  if (!db) throw new Error("Database not initialized");
  try {
    const docRef = await addDoc(collection(db, "gallery"), {
      url,
      caption,
      date: new Date().getFullYear().toString(),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const deleteImageFromDb = async (id: string) => {
  if (!db) throw new Error("Database not initialized");
  await deleteDoc(doc(db, "gallery", id));
};

export const subscribeToGallery = (callback: (images: any[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (querySnapshot: any) => {
    const images: any[] = [];
    querySnapshot.forEach((doc: any) => {
      images.push({ id: doc.id, ...doc.data() });
    });
    callback(images);
  }, (error: any) => console.error("Error subscribing to gallery:", error));
};

// --- GESTION TOURNÉE (TOUR DATES) ---

export const addTourDateToDb = async (dateObj: { venue: string; city: string; country: string; date: string; status: string }) => {
  if (!db) throw new Error("Database not initialized");
  try {
    await addDoc(collection(db, "tour_dates"), {
      ...dateObj,
      createdAt: Timestamp.now()
    });
  } catch (e) {
    console.error("Error adding tour date: ", e);
    throw e;
  }
};

export const deleteTourDateFromDb = async (id: string) => {
  if (!db) throw new Error("Database not initialized");
  await deleteDoc(doc(db, "tour_dates", id));
};

export const subscribeToTourDates = (callback: (dates: any[]) => void) => {
  if (!db) return () => {};
  // On récupère tout, on triera côté client pour séparer passé/futur
  const q = query(collection(db, "tour_dates"), orderBy("date", "asc"));
  return onSnapshot(q, (querySnapshot: any) => {
    const dates: any[] = [];
    querySnapshot.forEach((doc: any) => {
      dates.push({ id: doc.id, ...doc.data() });
    });
    callback(dates);
  }, (error: any) => console.error("Error subscribing to tour dates:", error));
};
