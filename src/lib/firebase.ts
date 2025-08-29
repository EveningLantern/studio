// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "apiKey": "AIzaSyAxpUhgK44NVtrHdr3BJk34AgCnDIGPWKU",
  "authDomain": "digitalindian-65bad.firebaseapp.com",
  "projectId": "digitalindian-65bad",
  "storageBucket": "digitalindian-65bad.firebasestorage.app",
  "messagingSenderId": "81622819101",
  "appId": "1:81622819101:web:9f8377655688f9e11681f4",
  "measurementId": "G-8HB6WJP35E"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
