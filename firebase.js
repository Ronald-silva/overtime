// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore importação

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3v62AFvXX-g9jSOYTLXcJHEl0XC_yqkc",
  authDomain: "app-quizmundy.firebaseapp.com",
  projectId: "app-quizmundy",
  storageBucket: "app-quizmundy.appspot.com",
  messagingSenderId: "447709836943",
  appId: "1:447709836943:web:46a3904b7bc70fe42fa2fa",
  measurementId: "G-FN48SJZX8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app); // Aqui está o Firestore sendo inicializado

export { db }; // Exporta o Firestore para uso em outras partes do app
