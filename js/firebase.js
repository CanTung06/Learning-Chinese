import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuMXMLPDIRG_Spnf1yD0-x1mzdh6cv5uk",
  authDomain: "learning-chinese-a88ac.firebaseapp.com",
  projectId: "learning-chinese-a88ac",
  storageBucket: "learning-chinese-a88ac.firebasestorage.app",
  messagingSenderId: "695922961177",
  appId: "1:695922961177:web:11d4b2c3a3a068f1bdb388",
  measurementId: "G-MN7THEXCBQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);