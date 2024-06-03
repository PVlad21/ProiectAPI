import { auth } from './firebase-config.js'; // Importă modulul pentru autentificare Firebase
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js"; // Importă funcția signInWithEmailAndPassword pentru autentificare

// Atașează un eveniment de click butonului de login
document.getElementById("loginButton").addEventListener("click", function() {
    // Obține adresa de email și parola introduse de utilizator
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Autentificare utilizând adresa de email și parola introduse
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Dacă autentificarea este reușită, redirecționează utilizatorul către pagina principală
            window.location.href = "index.html";
        })
        .catch((error) => {
            // Dacă apare o eroare în timpul autentificării, afișează un mesaj de eroare în consolă
            const errorMessage = error.message;
            console.error(errorMessage);
            // Poți gestiona erorile de autentificare aici, de exemplu, afișând un mesaj de eroare utilizatorului
        });
});
