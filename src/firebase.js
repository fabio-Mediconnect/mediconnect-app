import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// INCOLLA QUI le tue chiavi Firebase che hai copiato prima
const firebaseConfig = {
  const firebaseConfig = {
  apiKey: "AIzaSyC3fzUbklIBxNh58RCdNFtZ_mAsvHmBCWE",
  authDomain: "mediconnect-cadcd.firebaseapp.com",
  projectId: "mediconnect-cadcd",
  storageBucket: "mediconnect-cadcd.firebasestorage.app",
  messagingSenderId: "533814283713",
  appId: "1:533814283713:web:8a5bb946c5948b9fdc3340"
    };
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);