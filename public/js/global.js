// Vänta tills hela DOM är laddad innan vi kör koden
document.addEventListener('DOMContentLoaded', () => {

  // Ladda header.html och injicera den i #header-container
  fetch('/views/partials/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
    })
    .catch(error => {
      console.error("Error loading header:", error);
    });

  // Ladda navigation.html och injicera den i #navigation-container
  fetch('/views/partials/navigation.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navigation-container').innerHTML = html;
    })
    .catch(error => {
      console.error("Error loading navigation:", error);
    });

  // Ladda footer.html och injicera den i #footer-container
  fetch('/views/partials/footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('footer-container').innerHTML = html;
    })
    .catch(error => {
      console.error("Error loading footer:", error);
    });

  // Funktion för att öppna och stänga menyn
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    document.getElementById('hamburger-menu').addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Funktion för att öppna och stänga modals
  function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
  }

  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  // Hantera login och register modals
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.addEventListener('click', () => openModal('login-modal'));
  }

  const registerLink = document.getElementById('register-link');
  if (registerLink) {
    registerLink.addEventListener('click', () => openModal('register-modal'));
  }

  const loginSubmit = document.getElementById('login-submit');
  if (loginSubmit) {
    loginSubmit.addEventListener('click', loginUser);
  }

  const registerSubmit = document.getElementById('register-submit');
  if (registerSubmit) {
    registerSubmit.addEventListener('click', registerUser);
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }

  // Logout-funktion
  function logoutUser() {
    fetch('/auth/logout')
      .then(response => response.json())
      .then(() => {
        document.getElementById('login-register-links').style.display = 'block';
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('header-subtitle').innerText = 'Play your favorite games online and challenge your friends!';
      });
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

  // Stäng modals om användaren klickar utanför modal-fönstret
  window.onclick = function(event) {
    if (event.target.className === 'modal') {
      closeModal('login-modal');
      closeModal('register-modal');
    }
  }

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
});
