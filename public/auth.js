// Importăm obiectul 'auth' și funcția 'onAuthStateChanged' din fișierul 'firebase-config.js'
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// Listener pentru schimbările în starea de autentificare a utilizatorului
onAuthStateChanged(auth, (user) => {
    // Verificăm dacă utilizatorul este autentificat
    if (user) {
        // Dacă utilizatorul este autentificat, afișăm conținutul principal
        document.getElementById('mainContent').style.display = 'block';
    } else {
        // Dacă utilizatorul nu este autentificat, redirecționăm către pagina de login
        window.location.href = "login.html";
    }
});
