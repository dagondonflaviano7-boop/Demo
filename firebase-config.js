import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyA4j6nnERBXVprc69g_bp6oUVFC4mDdjdM",
  authDomain: "pdftoexcel-43588.firebaseapp.com",
  databaseURL: "https://pdftoexcel-43588-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pdftoexcel-43588",
  storageBucket: "pdftoexcel-43588.firebasestorage.app",
  messagingSenderId: "203140029921",
  appId: "1:203140029921:web:9ce8208e9bd38da8a686a0",
  measurementId: "G-0QR496Y68P"
};

const firebaseApp = initializeApp(firebaseConfig);

export const rtdb = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);