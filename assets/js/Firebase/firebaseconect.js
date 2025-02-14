import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBxFJhd6NZ5n-s4_s_vooBoHiyUw4G9xHE",
    authDomain: "consumos-dashboard.firebaseapp.com",
    databaseURL: "https://consumos-dashboard-default-rtdb.firebaseio.com",
    projectId: "consumos-dashboard",
    storageBucket: "consumos-dashboard.firebasestorage.app",
    messagingSenderId: "829352713763",
    appId: "1:829352713763:web:cb6b28d1ce2eea0c455b96"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup, signOut };