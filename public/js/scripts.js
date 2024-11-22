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
                    localStorage.removeItem('userId'); // Remove userId from localStorage on logout
                    checkLoginStatus();
                    alert('You have logged out.');
                    window.location.href = '/'; // Redirect to index.html
                });
            } else {
                console.error("[scripts.js] Logout button not found.");
            }
            addNavigationEventListeners(); // Lägg till eventhanterare efter headern har laddats
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
    console.log("[scripts.js] toggleMobileNav() called.");
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        if (mobileNav.style.display === 'block') {
            console.log("[scripts.js] Mobile nav is currently visible. Hiding it.");
            mobileNav.style.display = 'none';
        } else {
            console.log("[scripts.js] Mobile nav is currently hidden. Showing it.");
            mobileNav.style.display = 'block';
        }
    } else {
        console.warn("[scripts.js] mobile-nav element not found in toggleMobileNav().");
    }
}
// Lägg till event listeners för Register och Login efter att headern är laddad
function addNavigationEventListeners() {
    console.log("[scripts.js] Adding navigation event listeners.");

    const registerLink = document.getElementById('register');
    const loginLink = document.getElementById('login');
    const mobileNav = document.getElementById('mobile-nav');

    if (!mobileNav) {
        console.warn("[scripts.js] mobile-nav element not found.");
    }

    if (registerLink) {
        console.log("[scripts.js] Register link found.");
        registerLink.addEventListener('click', function(event) {
            console.log("[scripts.js] Register link clicked.");
            event.preventDefault(); // Förhindrar den normala länkhändelsen
            if (mobileNav) {
                console.log("[scripts.js] Closing mobile nav.");
                closeMobileNav(); // Stänger mobilnavet
            }
            openRegisterForm(); // Öppnar registerformuläret
        });
    } else {
        console.warn("[scripts.js] Register link not found.");
    }

    if (loginLink) {
        console.log("[scripts.js] Login link found.");
        loginLink.addEventListener('click', function(event) {
            console.log("[scripts.js] Login link clicked.");
            event.preventDefault(); // Förhindrar den normala länkhändelsen
            if (mobileNav) {
                console.log("[scripts.js] Closing mobile nav.");
                closeMobileNav(); // Stänger mobilnavet
            }
            openLoginForm(); // Öppnar loginformuläret
        });
    } else {
        console.warn("[scripts.js] Login link not found.");
    }
}
// Funktion för att stänga mobilnavet
function closeMobileNav() {
    console.log("[scripts.js] closeMobileNav() called.");
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.style.display = 'none'; // Döljer menyn
        console.log("[scripts.js] Mobile nav is now hidden.");
    } else {
        console.warn("[scripts.js] mobile-nav element not found in closeMobileNav().");
    }
}
// Funktion för att hantera logout
document.addEventListener('DOMContentLoaded', function () {
    console.log("[scripts.js] DOMContentLoaded event triggered for logout setup.");
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (event) {
            console.log("[scripts.js] Logout link clicked.");
            event.preventDefault(); // Förhindrar standardlänkhändelsen
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            alert('You have logged out.');
            checkLoginStatus();
            window.location.href = '/'; // Omdirigera till hemsidan
        });
    } else {
        console.warn("[scripts.js] Logout link not found.");
    }
});
// Funktion för att hantera när sidan laddas om och mobilenav kan vara öppet
window.addEventListener('resize', function () {
    console.log("[scripts.js] Window resize detected.");
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && window.innerWidth > 768) {
        console.log("[scripts.js] Hiding mobile nav on larger screens.");
        closeMobileNav(); // Stäng mobilnavigering om skärmen blir större än mobilstorlek
    }
});
// Extra felsökningsloggar
document.addEventListener('DOMContentLoaded', function () {
    console.log("[scripts.js] Running post-DOMContentLoaded setup.");
    console.log("[scripts.js] Current window width:", window.innerWidth);
    // Kontrollera om viktiga element finns
    const mobileNav = document.getElementById('mobile-nav');
    const registerLink = document.getElementById('register');
    const loginLink = document.getElementById('login');
    console.log("[scripts.js] mobile-nav exists:", !!mobileNav);
    console.log("[scripts.js] register link exists:", !!registerLink);
    console.log("[scripts.js] login link exists:", !!loginLink);
});
