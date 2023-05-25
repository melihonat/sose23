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
passwordInput.addEventListener("blur", function() {
  validatePassword();
});

passwordInput.addEventListener("focus", function() {
  hidePasswordHint();
});

// Funktion zur Überprüfung des Passworts
function validatePassword() {
  var password = passwordInput.value;
  var passwordRepeat = document.getElementById("password-repeat").value;
  var passwordHint = document.getElementById("password-hint");

  // Hinweis zurücksetzen
  hidePasswordHint();

  // Mindestlänge von 7 Zeichen überprüfen
  if (password.length < 7) {
    passwordHint.textContent = "The password must be at least 7 characters long.";
    passwordHint.style.display = "block";
    return;
  }

  // Mindestens 5 Ziffern überprüfen
  var digitCount = password.match(/\d/g).length;
  if (digitCount < 5) {
    passwordHint.textContent = "The password must contain at least 5 digits.";
    passwordHint.style.display = "block";
    return;
  }

  // Mindestens einen Großbuchstaben überprüfen
  if (!/[A-Z]/.test(password)) {
    passwordHint.textContent = "The password must contain at least one capital letter.";
    passwordHint.style.display = "block";
    return;
  }

  // Mindestens einen Kleinbuchstaben überprüfen
  if (!/[a-z]/.test(password)) {
    passwordHint.textContent = "The password must contain at least one lowercase letter.";
    passwordHint.style.display = "block";
    return;
  }

  // Passwort-Wiederholung überprüfen
  if (password !== passwordRepeat) {
    passwordHint.textContent = "The passwords do not match.";
    passwordHint.style.display = "block";
    return;
  }
}

// Funktion zum Ausblenden des Hinweises
function hidePasswordHint() {
  var passwordHint = document.getElementById("password-hint");
  passwordHint.style.display = "none";
}

// Event-Listener für das Formular hinzufügen
document.getElementById("register").addEventListener("submit", function(e) {
  e.preventDefault();

  // Passwort überprüfen
  validatePassword();

  // Wenn alle Überprüfungen erfolgreich sind, können Sie den Registrierungsprozess fortsetzen
  console.log("Registration submitted");
});