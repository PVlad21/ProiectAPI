import { auth } from './firebase-config.js'; // Se importă modulul de autentificare Firebase și instanța de autentificare

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js"; // Se importă funcția pentru crearea unui utilizator cu adresa de email și parola

// Se adaugă un ascultător de eveniment pentru butonul de înregistrare
document.getElementById("registerButton").addEventListener("click", function() {
    // Se preia valoarea introdusă în câmpurile pentru email și parolă
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Se apelează funcția de creare a utilizatorului cu adresa de email și parola
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Înregistrare și autentificare reușită
            window.location.href = "index.html"; // Se redirecționează utilizatorul către pagina principală
        })
        .catch((error) => {
            const errorMessage = error.message; // Se preia mesajul de eroare
            console.error(errorMessage); // Se afișează mesajul de eroare în consolă
            // Se gestionează erorile de înregistrare, de exemplu, afișând un mesaj de eroare utilizatorului
        });
});
