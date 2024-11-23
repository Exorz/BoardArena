// Basic client-side logger
function log(message) {
    console.log(`[Client Log] ${message}`);
}

console.log('[scripts.js] Initializing scripts.js script.');

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
    console.log('[scripts.js] DOM fully loaded.');

    // Load header, footer, and navigation sequentially
    Promise.all([
        loadHeaderAndFooter(), 
        loadNavigation()
    ]).then(() => {
        // After all resources are loaded, check login status
        console.log('[scripts.js] All resources loaded.');
        checkLoginStatus();  // Only run login check after everything is in place
    }).catch(error => {
        console.error('[scripts.js] Error loading resources:', error);
    });
});

// Load header and footer
function loadHeaderAndFooter() {
    console.log('[scripts.js] Loading header and footer.');

    // Return promises for header and footer
    return Promise.all([
        fetch('/partials/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error("[scripts.js] Failed to load header.html. Status: " + response.status);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('header-container').innerHTML = data;
                console.log('[scripts.js] Header loaded.');
            })
            .catch(error => {
                console.error('[scripts.js] Error loading header:', error);
            }),

        fetch('/partials/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error("[scripts.js] Failed to load footer.html. Status: " + response.status);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('footer-container').innerHTML = data;
                console.log('[scripts.js] Footer loaded.');
            })
            .catch(error => {
                console.error('[scripts.js] Error loading footer:', error);
            })
    ]);
}

// Load navigation (hamburger menu included)
function loadNavigation() {
    console.log('[scripts.js] Loading navigation.');

    // Return promise for navigation loading
    return fetch('/partials/navigation.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("[scripts.js] Failed to load navigation.html. Status:", response.status);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('navigation').innerHTML = data;
            console.log('[scripts.js] Navigation loaded.');

            // Initialize hamburger menu toggle
            const hamburgerMenu = document.getElementById('hamburger-menu');
            if (hamburgerMenu) {
                hamburgerMenu.addEventListener('click', toggleMenu);
                console.log('[scripts.js] Hamburger menu click listener added.');
            }

            // Initialize logout button after loading navigation
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            } else {
                console.error("[scripts.js] Logout button not found.");
            }
        })
        .catch(error => {
            console.error('[scripts.js] Error loading navigation:', error);
        });
}

// Toggle menu (for the hamburger)
function toggleMenu() {
    var nav = document.querySelector('.nav');
    nav.classList.toggle('active');
    console.log('[scripts.js] Hamburger menu clicked. Toggling menu visibility.');
    console.log('[scripts.js] Current classes on nav:', nav.classList);
    console.log('[scripts.js] Menu display property:', getComputedStyle(nav).display);


    
    if (!nav || !ul) {
        console.error('[scripts.js] nav or ul element not found.');
        return;
    }

    console.log('[scripts.js] Current classes on nav: ', nav.classList);
    nav.classList.toggle('active');
    
    console.log('[scripts.js] Menu toggled. Active class: ', nav.classList.contains('active'));

    // Log the display property of the menu
    console.log('[scripts.js] Menu display property: ', window.getComputedStyle(ul).display);
}





// Handle logout
function handleLogout() {
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

    // Log if elements are missing
    if (!loginLink || !registerLink || !logoutLink || !userInfo || !usernameDisplay) {
        console.error("[scripts.js] One or more elements not found. Check the HTML structure.");
    } else {
        console.log('All required elements found.'); 
    }

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
    }
}

// Open login form
function openLoginForm() {
    console.log('[scripts.js] Opening login form.');
    document.getElementById('loginForm').style.display = 'block';
}

// Open register form
function openRegisterForm() {
    console.log('[scripts.js] Opening register form.');
    document.getElementById('registerForm').style.display = 'block';
}

// Close login/register form
function closeForm() {
    console.log('[scripts.js] Closing form.');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
}

// Login user
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

// Register user
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
