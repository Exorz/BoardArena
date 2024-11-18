document.addEventListener('DOMContentLoaded', () => {
  // Ladda header.html och injicera den i #header-container
  fetch('/partials/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
    })
    .catch(error => {
      console.error("Error loading header:", error);
    });

  // Ladda navigation.html och injicera den i #navigation-container
  fetch('/partials/navigation.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navigation-container').innerHTML = html;
    })
    .catch(error => {
      console.error("Error loading navigation:", error);
    });

  // Ladda footer.html och injicera den i #footer-container
  fetch('/partials/footer.html')
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
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }
  }

  // Funktion för att öppna och stänga modals
  function openModal(modalId) {
    console.log('Opening modal:', modalId);  // Debugging: Kontrollera om vi försöker öppna modalen
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';  // Visa modalen
    } else {
      console.error('Modal not found:', modalId);  // Debugging: Om modalen inte hittas
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';   // Dölja modalen
    } else {
      console.error('Modal not found for closing:', modalId);  // Debugging: Om modalen inte hittas
    }
  }

  // Hantera login och register modals
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    console.log('Login link found');  // Debugging: Kontrollera om login-länken finns
    loginLink.addEventListener('click', (event) => {
      event.preventDefault();  // Förhindra standardlänk beteende
      openModal('login-modal');  // Visa login modal
    });
  } else {
    console.error('Login link not found');  // Debugging: Om login-länken inte hittas
  }

  const registerLink = document.getElementById('register-link');
  if (registerLink) {
    console.log('Register link found');  // Debugging: Kontrollera om register-länken finns
    registerLink.addEventListener('click', (event) => {
      event.preventDefault();  // Förhindra standardlänk beteende
      openModal('register-modal');  // Visa register modal
    });
  } else {
    console.error('Register link not found');  // Debugging: Om register-länken inte hittas
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
