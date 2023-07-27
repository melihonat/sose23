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

// Anfangs-Tab setzen (Login)
document.getElementById("loginTab").classList.add("active");
document.getElementById("login").style.display = "block";
document.getElementById("register").style.display = "none";

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
            var response = xhr.responseText;
            try {
                var jsonResponse = JSON.parse(response);
                if (jsonResponse.status === "registration_success") {
                    // Registration successful, hide the registration form and show the login form
                    document.getElementById("register").style.display = "none";
                    document.getElementById("login").style.display = "block";
                    console.log("Registration successful.");
                } else {
                    console.log("Invalid response status");
                }
            } catch (e) {
                console.log("Error parsing JSON response");
                console.log("Response: ", response);
            }
        } else {
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

            try {
                var jsonResponse = JSON.parse(response);

                if (jsonResponse.hasOwnProperty('status')) {
                    if (jsonResponse.status === "login_success") {
                        // Erfolgreicher Login für normalen Spieler
                        var playerData = jsonResponse.data;
                        // Weiterleiten zum Hauptmenü mit SpielerID
                        window.location.href = "../Main Menu/main_menu.html?id=" + encodeURIComponent(playerData.id) + "&name=" + encodeURIComponent(playerData.name);
                    } else if (jsonResponse.status === "admin_login_success") {
                        // Erfolgreicher Login für Admin
                        console.log("Admin Login erfolgreich.");
                        window.location.href = "../Admin Panel/adminindex.html";
                    } else {
                        console.log("Invalid response status");
                    }
                } else {
                    console.log("Invalid response format");
                }
            } catch (e) {
                console.log("Error parsing JSON response");
                console.log("Response: ", response);
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