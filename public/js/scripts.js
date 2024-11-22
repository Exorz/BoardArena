// Basic client-side logger
function log(message) {
    console.log(`[Client Log] ${message}`);
}

console.log('[scripts.js] Initializing scripts.js script.');

function loadHeaderAndFooter() {
    console.log('[scripts.js] Loading header and footer.');
    fetch('/partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            console.log('[scripts.js] Header loaded.');

            checkLoginStatus();

            const logoutButton = document.getElementById('logout-button');
       if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        console.log('[scripts.js] Logout button clicked.');
        const socket = window.socket;
        if (socket) {
            socket.emit('logout');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');  // Remove userId from localStorage on logout
        checkLoginStatus();
        alert('You have logged out.');

        // Lägg till omdirigering till index.html
        window.location.href = '/';

    });
            } else {
                console.error("[scripts.js] Logout button not found.");
            }
        })
        .catch(error => {
            console.error('[scripts.js] Error loading header:', error);
        });

    fetch('/partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
            console.log('[scripts.js] Footer loaded.');
        })
        .catch(error => {
            console.error('[scripts.js] Error loading footer:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadHeaderAndFooter);

function checkLoginStatus() {
    console.log('[scripts.js] Checking login status.');
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
            console.log("[scripts.js] User logged in as:", username);
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
    console.log('[scripts.js] Opening login form.');
    document.getElementById('loginForm').style.display = 'block';
}

function openRegisterForm() {
    console.log('[scripts.js] Opening register form.');
    document.getElementById('registerForm').style.display = 'block';
}

function closeForm() {
    console.log('[scripts.js] Closing form.');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
}

async function login() {
    console.log('[scripts.js] Logging in.');
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

        // Extract userId from token and save to localStorage
        const base64Url = data.token.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        localStorage.setItem('userId', decodedValue._id);

        alert('Login successful!');
        closeForm();
        window.location.href = '/games';
    } else {
        document.getElementById('login-message').innerText = data.message;
        console.error('[scripts.js] Login failed:', data.message);
    }
}

async function register() {
    console.log('[scripts.js] Registering new user.');
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

        // Extract userId from token and save to localStorage
        const base64Url = data.token.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        localStorage.setItem('userId', decodedValue._id);

        alert('Registration successful!');
        closeForm();
        window.location.href = '/games';
    } else {
        document.getElementById('register-message').innerText = data.message;
        console.error('[scripts.js] Registration failed:', data.message);
    }
}

    // Funktion för att toggla den mobila menyn
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav.style.display === 'block') {
        mobileNav.style.display = 'none';  // Om menyn är synlig, döljs den
    } else {
        mobileNav.style.display = 'block'; // Om menyn är dold, visas den
    }
}

// Lägg till event listeners för att stänga menyn när "Login" eller "Register" klickas
document.getElementById('register')?.addEventListener('click', function(event) {
    closeMobileNav();  // Stänger menyn när register länken klickas
});

document.getElementById('login')?.addEventListener('click', function(event) {
    closeMobileNav();  // Stänger menyn när login länken klickas
});

// Funktion för att stänga menyn
function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.style.display = 'none';  // Döljer menyn
}
