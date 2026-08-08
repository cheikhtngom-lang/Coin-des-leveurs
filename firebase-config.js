import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: REMPLACEZ CET OBJET PAR VOTRE PROPRE CONFIGURATION FIREBASE
// Vous trouverez ceci dans la console Firebase (Paramètres du projet > Général > Vos applications)
const firebaseConfig = {
  apiKey: "AIzaSyAqNthFiT0JEcu1ewqtJZqEed77jbPpicE",
  authDomain: "coineleveurs.firebaseapp.com",
  projectId: "coineleveurs",
  storageBucket: "coineleveurs.firebasestorage.app",
  messagingSenderId: "183217191553",
  appId: "1:183217191553:web:a3ff07162ac6ee747e6b80",
  measurementId: "G-6EFQN7CBB8"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
