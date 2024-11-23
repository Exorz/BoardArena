// Basic client-side logger
function log(message) {
    console.log(`[Client Log] ${message}`);
}

console.log('[scripts.js] Initializing scripts.js script.');

function loadHeaderAndFooter() {
    console.log('[scripts.js] Loading header and footer.');
    
    // Load header
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

                    // Redirect to index.html
                    window.location.href = '/';
                });
            } else {
                console.error("[scripts.js] Logout button not found.");
            }
        })
        .catch(error => {
            console.error('[scripts.js] Error loading header:', error);
        });

    // Load footer
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

// Load navigation (hamburger menu included)
function loadNavigation() {
    console.log('[scripts.js] Loading navigation.');

    fetch('/partials/navigation.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navigation').innerHTML = data;
            console.log('[scripts.js] Navigation loaded.');

            // Initialize hamburger menu toggle
            const hamburgerMenu = document.getElementById('hamburger-menu');
            if (hamburgerMenu) {
                hamburgerMenu.addEventListener('click', toggleMenu);
            }
        })
        .catch(error => {
            console.error('[scripts.js] Error loading navigation:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeaderAndFooter();
    loadNavigation();  // Load the navigation as well
});

// Toggle menu (for the hamburger)
function toggleMenu() {
    var nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}





// Check login status and show/hide appropriate links
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

// Toggle menu (for the hamburger)
function toggleMenu() {
    var nav = document.querySelector('.nav');
    nav.classList.toggle('active');
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
