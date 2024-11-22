// Basic client-side logger
function log(message) {
    console.log(`[Client Log] ${message}`);
}

function loadHeaderAndFooter() {
    fetch('/partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            checkLoginStatus();
            addNavigationEventListeners();
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
    } else {
        console.error("[scripts.js] One or more elements not found. Check the HTML structure.");
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
        alert('Login successful!');
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
        alert('Registration successful!');
        closeForm();
        window.location.href = '/games';
    } else {
        document.getElementById('register-message').innerText = data.message;
    }
}

// Toggle mobile navigation
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
    }
}

// Close mobile menu if clicking outside
function closeMobileNavIfClickedOutside(event) {
    const mobileNav = document.getElementById('mobile-nav');
    const hamburgerButton = document.getElementById('hamburger-menu');
    if (mobileNav && !mobileNav.contains(event.target) && !hamburgerButton.contains(event.target)) {
        mobileNav.style.display = 'none';
    }
}

// Add event listeners for navigation links
function addNavigationEventListeners() {
    const registerLink = document.getElementById('register');
    const loginLink = document.getElementById('login');
    const mobileNav = document.getElementById('mobile-nav');

    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (mobileNav) mobileNav.style.display = 'none'; // Close mobile nav when clicking a link
            openRegisterForm();
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (mobileNav) mobileNav.style.display = 'none'; // Close mobile nav when clicking a link
            openLoginForm();
        });
    }

    // Close mobile menu when clicking a mobile navigation link
    const mobileLinks = document.querySelectorAll('#mobile-nav ul li a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileNav();
        });
    });
}

// Close the mobile menu when clicking outside
window.addEventListener('click', closeMobileNavIfClickedOutside);

// Toggle hamburger menu
document.getElementById('hamburger-menu').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the event from propagating to the document and closing the menu
    toggleMobileNav();
});

// Handle logout
document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            alert('You have logged out.');
            checkLoginStatus();
            window.location.href = '/'; // Redirect to homepage
        });
    }
});

// Close mobile nav on window resize if screen is larger than mobile size
window.addEventListener('resize', function () {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && window.innerWidth > 768) {
        closeMobileNav();
    }
});
