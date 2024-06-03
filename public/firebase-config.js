import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDnlHEI3vlC4fHYkst3pJY_xihq_5F7q4",
  authDomain: "proiect-api.firebaseapp.com",
  projectId: "proiect-api",
  storageBucket: "proiect-api.appspot.com",
  messagingSenderId: "219544071676",
  appId: "1:219544071676:web:f2b9a030fd94ffb50d1679"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
