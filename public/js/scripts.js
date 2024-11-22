// Basic client-side logger (removed for now)
function log(message) {
    console.log(`[Client Log] ${message}`);
}

console.log('[scripts.js] Initializing scripts.js script.');

function loadHeaderAndFooter() {
    fetch('/partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            checkLoginStatus();
            addNavigationEventListeners();  // Lägg till eventhanterare efter headern har laddats
        })
        .catch(error => {
            console.error('[scripts.js] Error loading header:', error);
        });

    fetch('/partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => {
            console.error('[scripts.js] Error loading footer:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadHeaderAndFooter);

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login');
    const registerLink = document.getElementById('register');
    const logoutLink = document.getElementById('logout');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (token) {
        loginLink.hidden = true;
        registerLink.hidden = true;
        logoutLink.hidden = false;
        userInfo.hidden = false;

        const username = localStorage.getItem('username');
        usernameDisplay.textContent = username || 'User';
    } else {
        loginLink.hidden = false;
        registerLink.hidden = false;
        logoutLink.hidden = true;
        userInfo.hidden = true;
    }
}

function openLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
}
function openRegisterForm() {
    document.getElementById('registerForm').style.display = 'block';
}
function closeForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        const base64Url = data.token.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        localStorage.setItem('userId', decodedValue._id);
        closeForm();
        window.location.href = '/games';
    } else {
        document.getElementById('login-message').innerText = data.message;
    }
}

async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        const base64Url = data.token.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        localStorage.setItem('userId', decodedValue._id);
        closeForm();
        window.location.href = '/games';
    } else {
        document.getElementById('register-message').innerText = data.message;
    }
}

// Function to toggle mobile menu visibility
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        if (mobileNav.style.display === 'block') {
            mobileNav.style.display = 'none';
        } else {
            mobileNav.style.display = 'block';
        }
    }
}

// Add event listeners for mobile nav and links
function addNavigationEventListeners() {
    const registerLink = document.getElementById('register');
    const loginLink = document.getElementById('login');
    const mobileNav = document.getElementById('mobile-nav');

    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link action
            if (mobileNav) closeMobileNav(); // Close mobile nav if it's open
            openRegisterForm(); // Open register form
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link action
            if (mobileNav) closeMobileNav(); // Close mobile nav if it's open
            openLoginForm(); // Open login form
        });
    }
}

// Function to close mobile nav when clicking outside
function closeMobileNavOnClickOutside(event) {
    const mobileNav = document.getElementById('mobile-nav');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (mobileNav && hamburgerMenu && !mobileNav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        mobileNav.style.display = 'none';
    }
}

document.addEventListener('click', closeMobileNavOnClickOutside);

// Function to handle window resizing
window.addEventListener('resize', function () {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && window.innerWidth > 768) {
        closeMobileNav(); // Hide mobile nav on larger screens
    }
// Funktion för att stänga mobilnavet när en länk klickas på i hamburgarmenyn
function closeMobileNavOnLinkClick(event) {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && mobileNav.style.display === 'block') {
        mobileNav.style.display = 'none'; // Döljer menyn när en länk är klickad
    }
}

// Lägg till event listeners för varje länk i hamburgarmenyn
function addMobileNavLinkListeners() {
    const mobileNavLinks = document.querySelectorAll('#mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNavOnLinkClick);
    });
}

// Lägg till event listeners för öppning och stängning av mobilmenyn
function addHamburgerMenuListeners() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function(event) {
            event.stopPropagation(); // Förhindra att click-händelsen sprider sig
            toggleMobileNav(); // Växla mobilmenyn
        });
    } else {
        console.warn("[scripts.js] Hamburger menu element not found.");
    }
}

// Funktion för att stänga mobilnavet
function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.style.display = 'none'; // Döljer menyn
    }
}

// Lägg till alla event listeners när sidan är laddad
document.addEventListener('DOMContentLoaded', function () {
    // Lägg till event listeners för hamburgerknappen
    addHamburgerMenuListeners();

    // Lägg till event listeners för länkar i mobilnavet
    addMobileNavLinkListeners();

    // Lägg till event listener för att stänga menyn om man klickar utanför
    document.addEventListener('click', closeMobileNavOnClickOutside);
});

// Säkerställ att navigeringslänkarna fungerar korrekt när användaren är inloggad
function updateNavigationForLoggedInUser() {
    const loginLink = document.getElementById('login');
    const registerLink = document.getElementById('register');
    const logoutLink = document.getElementById('logout');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    const token = localStorage.getItem('token');

    if (loginLink && registerLink && logoutLink && userInfo && usernameDisplay) {
        if (token) {
            loginLink.hidden = true;
            registerLink.hidden = true;
            logoutLink.hidden = false;
            userInfo.hidden = false;

            const username = localStorage.getItem('username');
            usernameDisplay.textContent = username || 'User';
        } else {
            loginLink.hidden = false;
            registerLink.hidden = false;
            logoutLink.hidden = true;
            userInfo.hidden = true;
        }
    }
}

// Anrop för att uppdatera navigation när sidan har laddats
document.addEventListener('DOMContentLoaded', updateNavigationForLoggedInUser);

// Hantera logout funktion
document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            alert('You have logged out.');
            updateNavigationForLoggedInUser(); // Uppdatera navigationen när användaren loggas ut
            window.location.href = '/'; // Redirect to homepage
        });
    }
});
