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
        console.log('Login link found');
        loginLink.addEventListener('click', (event) => {
          event.preventDefault();  // Förhindra standardlänk beteende
          openModal('login-modal');  // Visa login modal
        });
      }

      const registerLink = document.getElementById('register-link');
      if (registerLink) {
        console.log('Register link found');
        registerLink.addEventListener('click', (event) => {
          event.preventDefault();  // Förhindra standardlänk beteende
          openModal('register-modal');  // Visa register modal
        });
      }

      // Lägg till eventlyssnare för Close-knapparna
      const closeLoginModal = document.querySelector('#login-modal .close');
      if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => closeModal('login-modal'));
      }

      const closeRegisterModal = document.querySelector('#register-modal .close');
      if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', () => closeModal('register-modal'));
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
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';  // Visa modalen
    } else {
      console.error('Modal not found:', modalId);
    }
  }

  // Funktion för att stänga modaler
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';  // Dölja modalen
    } else {
      console.error('Modal not found for closing:', modalId);
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
    fetch('/auth/logout')
      .then(response => response.json())
      .then(() => {
        document.getElementById('login-register-links').style.display = 'block';
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('header-subtitle').innerText = 'Play your favorite games online and challenge your friends!';
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
