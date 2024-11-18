// /public/js/global.js

// Funktion för att öppna och stänga menyn
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('open'); // Lägg till eller ta bort 'open'-klassen
}

// Funktion för att öppna och stänga modals
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Hantera login och register modals
document.getElementById('login-link').addEventListener('click', () => openModal('login-modal'));
document.getElementById('register-link').addEventListener('click', () => openModal('register-modal'));
document.getElementById('login-submit').addEventListener('click', loginUser);
document.getElementById('register-submit').addEventListener('click', registerUser);

// Stäng modals om användaren klickar utanför modal-fönstret
window.onclick = function(event) {
  if (event.target.className === 'modal') {
    closeModal('login-modal');
    closeModal('register-modal');
  }
}

// Login-funktion
function loginUser() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login successful') {
        closeModal('login-modal');
        document.getElementById('login-register-links').style.display = 'none';
        document.getElementById('logout-link').style.display = 'block';
        document.getElementById('header-subtitle').innerText = `Logged in as: ${data.username}`;
      } else {
        alert('Invalid credentials');
      }
    });
}

// Register-funktion
function registerUser() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Registration successful') {
        alert('Registration successful! Please log in.');
        closeModal('register-modal');
      }
    });
}

// Logout-funktion
document.getElementById('logout-button').addEventListener('click', () => {
  fetch('/auth/logout')
    .then(response => response.json())
    .then(() => {
      document.getElementById('login-register-links').style.display = 'block';
      document.getElementById('logout-link').style.display = 'none';
      document.getElementById('header-subtitle').innerText = 'Play your favorite games online and challenge your friends!';
    });
});

// Kontrollera om användaren är inloggad vid sidladdning
fetch('/auth/user')
  .then(response => response.json())
  .then(data => {
    if (data.loggedIn) {
      document.getElementById('login-register-links').style.display = 'none';
      document.getElementById('logout-link').style.display = 'block';
      document.getElementById('header-subtitle').innerText = `Logged in as: ${data.username}`;
    }
  });
