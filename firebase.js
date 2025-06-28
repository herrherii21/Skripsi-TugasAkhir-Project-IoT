// ===================================================================
// firebase.js
// Konfigurasi dan inisialisasi Firebase untuk Smart Farming Control
// ===================================================================

// Import modul dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";

// -------------------------------------------------------------------
// Konfigurasi Firebase (gunakan kredensial dari Firebase Console)
// -------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDhckNigYyinZhdVHbKZTP17Vu-4Nt3dLs",
  authDomain: "smart-farming-apps.firebaseapp.com",
  databaseURL: "https://smart-farming-apps-default-rtdb.firebaseio.com",
  projectId: "smart-farming-apps",
  storageBucket: "smart-farming-apps.firebasestorage.app",
  messagingSenderId: "892869405795",
  appId: "1:892869405795:web:a459c8179e7945c9d7dc56"
};

// -------------------------------------------------------------------
// Inisialisasi Firebase App dan Database
// -------------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// -------------------------------------------------------------------
// Ekspor fungsi dan objek yang digunakan di bagian lain aplikasi
// -------------------------------------------------------------------
export { database, ref, update };