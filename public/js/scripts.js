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

            // Lägg till event listeners efter headern har laddats
            setupNavigationEventListeners();

            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', function () {
                    console.log('[scripts.js] Logout button clicked.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userId'); // Remove userId from localStorage on logout
                    checkLoginStatus();
                    alert('You have logged out.');
                    window.location.href = '/'; // Redirect to index.html
                });
            } else {
                console.warn("[scripts.js] Logout button not found.");
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

// Funktion för att lägga till event listeners efter headern laddats in
function setupNavigationEventListeners() {
    console.log("[scripts.js] Adding navigation event listeners.");

    const registerLink = document.getElementById('register');
    const loginLink = document.getElementById('login');
    const mobileNav = document.getElementById('mobile-nav');

    if (!mobileNav) {
        console.warn("[scripts.js] mobile-nav element not found.");
    }

    if (registerLink) {
        console.log("[scripts.js] Register link found.");
        registerLink.addEventListener('click', function (event) {
            console.log("[scripts.js] Register link clicked.");
            event.preventDefault(); // Förhindrar den normala länkhändelsen
            closeMobileNav(); // Stänger mobilnavet
            openRegisterForm(); // Öppnar registerformuläret
        });
    } else {
        console.warn("[scripts.js] Register link not found.");
    }

    if (loginLink) {
        console.log("[scripts.js] Login link found.");
        loginLink.addEventListener('click', function (event) {
            console.log("[scripts.js] Login link clicked.");
            event.preventDefault(); // Förhindrar den normala länkhändelsen
            closeMobileNav(); // Stänger mobilnavet
            openLoginForm(); // Öppnar loginformuläret
        });
    } else {
        console.warn("[scripts.js] Login link not found.");
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
