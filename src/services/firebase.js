import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // For authentication
import { getFirestore, GeoPoint } from 'firebase/firestore'; // For Firestore database
import { getStorage } from 'firebase/storage'; // For Firebase Storage (if needed)

const firebaseConfig = {
  apiKey: "AIzaSyDFaPG9Xi4Vk0Kf0lktDKVt4LLqOneJvmo",
  authDomain: "docyard-a911d.firebaseapp.com",
  projectId: "docyard-a911d",
  storageBucket: "docyard-a911d.firebasestorage.app",
  messagingSenderId: "595771688589",
  appId: "1:595771688589:web:d63cc130648ac6601984c4",
  measurementId: "G-9JB9CDKM6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, GeoPoint };
