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

      // Efter att navigation.html har laddats, binda eventlyssnare till login och register-länkar
      const loginLink = document.getElementById('login-link');
      if (loginLink) {
        loginLink.addEventListener('click', (event) => {
          event.preventDefault();
          openModal('login-modal');
        });
      }

      const registerLink = document.getElementById('register-link');
      if (registerLink) {
        registerLink.addEventListener('click', (event) => {
          event.preventDefault();
          openModal('register-modal');
        });
      }

      // Lägg till eventlyssnare för Close-knapparna
      const closeLoginModal = document.getElementById('login-close');
      if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => closeModal('login-modal'));
      }

      const closeRegisterModal = document.getElementById('register-close');
      if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', () => closeModal('register-modal'));
      }

      // Lägg till eventlyssnare för hamburgermenyn
      const hamburgerMenu = document.getElementById('hamburger-menu');
      if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMenu);
      }
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

  // Funktion för att öppna modaler
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';  // Visa modalen
    }
  }

  // Funktion för att stänga modaler
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';  // Dölja modalen
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
          localStorage.setItem('token', data.token); // Spara token i lokal lagring
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
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
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
  function logoutUser() {
    localStorage.removeItem('token'); // Ta bort token från lokal lagring
    document.getElementById('login-register-links').style.display = 'block';
    document.getElementById('logout-link').style.display = 'none';
    document.getElementById('header-subtitle').innerText = 'Play your favorite games online and challenge your friends!';
  }

  // Toggle hamburgermeny
  function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      navLinks.classList.toggle('open');
    }
  }

  // Stäng modals om användaren klickar utanför modal-fönstret
  window.onclick = function(event) {
    if (event.target.className === 'modal') {
      closeModal('login-modal');
      closeModal('register-modal');
    }
  }

  // Kontrollera om användaren är inloggad vid sidladdning
  const token = localStorage.getItem('token');
  if (token) {
    fetch('/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`,  // Skicka token som header
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.loggedIn) {
        document.getElementById('login-register-links').style.display = 'none';
        document.getElementById('logout-link').style.display = 'block';
        document.getElementById('header-subtitle').innerText = `Logged in as: ${data.username}`;
      }
    });
  }
});
