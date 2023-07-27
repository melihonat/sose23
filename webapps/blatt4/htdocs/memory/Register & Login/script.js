function openForm(evt, formName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("form");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Passwort-Feld referenzieren
var passwordInput = document.getElementById("password");

// Event-Listener für das Passwort-Feld hinzufügen
passwordInput.addEventListener("blur", function () {
    validatePassword();
});

passwordInput.addEventListener("focus", function () {
    hidePasswordHint();
});

// Funktion zur Überprüfung des Passworts
function validatePassword() {
    var password = passwordInput.value;
    var passwordRepeat = document.getElementById("password-repeat").value;
    var passwordHint = document.getElementById("password-hint");

    // Hinweis zurücksetzen
    hidePasswordHint();

    // Validierungsvariable initialisieren
    var isValid = true;

    // Mindestlänge von 7 Zeichen überprüfen
    if (password.length < 7) {
        passwordHint.textContent = "The password must be at least 7 characters long.";
        passwordHint.style.display = "block";
        isValid = false;
    }

    // Mindestens 1 Ziffer überprüfen
    var digitCount = password.match(/\d/g).length;
    if (digitCount < 1) {
        passwordHint.textContent = "The password must contain at least 1 digit.";
        passwordHint.style.display = "block";
        isValid = false;
    }

    // Mindestens einen Großbuchstaben überprüfen
    if (!/[A-Z]/.test(password)) {
        passwordHint.textContent = "The password must contain at least one capital letter.";
        passwordHint.style.display = "block";
        isValid = false;
    }

    // Mindestens einen Kleinbuchstaben überprüfen
    if (!/[a-z]/.test(password)) {
        passwordHint.textContent = "The password must contain at least one lowercase letter.";
        passwordHint.style.display = "block";
        isValid = false;
    }

    // Passwort-Wiederholung überprüfen
    if (password !== passwordRepeat) {
        passwordHint.textContent = "The passwords do not match.";
        passwordHint.style.display = "block";
        isValid = false;
    }

    // Rückgabe der Validierungsvariable
    return isValid;
}

// Funktion zum Ausblenden des Hinweises
function hidePasswordHint() {
    var passwordHint = document.getElementById("password-hint");
    passwordHint.style.display = "none";
}

// Event-Listener für das Formular "register"
document.getElementById("register").addEventListener("submit", function (e) {
    e.preventDefault();

    // Passwort überprüfen
    var isValid = validatePassword();

    // Wenn Validierung fehlschlägt, das Formular nicht absenden
    if (!isValid) {
        return;
    }

    // Wenn alle Überprüfungen erfolgreich sind, den Registrierungsprozess fortsetzen
    console.log("Registration submitted");
    var formData = new FormData(this); // this ist das Form element

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../player.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Request erfolgreich
            console.log(xhr.responseText);
        } else {
            // Request fehlgeschlagen
            console.error("Error: " + xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error("Network error");
    }

    xhr.send(formData);
});

// Event-Listener für die login form
document.getElementById("login").addEventListener("submit", function (e) {
    e.preventDefault();

    var email = this.email.value;
    var password = this.password.value;

    // AJAX request auf player.php zum Login
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../player.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = xhr.responseText;
            console.log("Response status: ", xhr.status);
            console.log("Response text: ", response);

            if (response === "login_success") {
                console.log("Login erfolgreich.");

                console.log("Email: ", email);

                if (email === "admin@memory.de") {
                    window.location.href = "../Admin Panel/adminindex.html";
                } else {
                    window.location.href = "spiel.html?name=" + encodeURIComponent(email)
                }
            } else {
                // Request fehlgeschlagen
                console.log("Ungültige E-Mail oder Passwort");
                console.log("Email and password: ", email, password);
            }
        } else {
            console.error("Error: " + xhr.status);
        }
    };
    
    xhr.onerror = function () {
        console.error("Network error");
    };

    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("login", "1"); // Login Flag

    xhr.send(formData);
});