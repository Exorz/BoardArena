// Basic client-side logger
function log(message) {
    console.log(`[Client Log] ${message}`);
}

console.log('[scripts.js] Initializing scripts.js script.');

document.addEventListener('DOMContentLoaded', function() {
    console.log('[scripts.js] Initializing scripts.js after DOM is loaded.');

    // Ladda header och footer när sidan är klar
    loadHeaderAndFooter();

    // Funktion för att toggla den mobila menyn
    function toggleMobileNav() {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav.style.display === 'block') {
            mobileNav.style.display = 'none';  // Om menyn är synlig, döljs den
        } else {
            mobileNav.style.display = 'block'; // Om menyn är dold, visas den
        }
    }

    // Lägg till event listeners för att stänga menyn när "Register" eller "Login" klickas
    const registerLink = document.getElementById('register');
    const loginLink = document.getElementById('login');

    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault(); // Förhindrar den normala länkhändelsen
            closeMobileNav();  // Stänger menyn när register länken klickas
            openRegisterForm(); // Öppnar registreringsformuläret
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // Förhindrar den normala länkhändelsen
            closeMobileNav();  // Stänger menyn när login länken klickas
            openLoginForm(); // Öppnar inloggningsformuläret
        });
    }

    // Funktion för att stänga menyn
    function closeMobileNav() {
        const mobileNav = document.getElementById('mobile-nav');
        mobileNav.style.display = 'none';  // Döljer menyn
    }

    // Funktion för att öppna registreringsformuläret
    function openRegisterForm() {
        console.log('[scripts.js] Opening register form.');
        document.getElementById('registerForm').style.display = 'block';
    }

    // Funktion för att öppna inloggningsformuläret
    function openLoginForm() {
        console.log('[scripts.js] Opening login form.');
        document.getElementById('loginForm').style.display = 'block';
    }

    // Funktion för att stänga modaler
    function closeForm() {
        console.log('[scripts.js] Closing form.');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
    }

    // Hantera inloggning
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

    // Hantera registrering
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

// Lägg till event listeners för att stänga menyn när "Register" eller "Login" klickas
document.getElementById('register')?.addEventListener('click', function(event) {
    event.preventDefault(); // Förhindrar den normala länkhändelsen (vi navigerar inte bort)
    closeMobileNav();  // Stänger menyn när register länken klickas
    openRegisterForm(); // Öppnar registreringsformuläret
});

document.getElementById('login')?.addEventListener('click', function(event) {
    event.preventDefault(); // Förhindrar den normala länkhändelsen (vi navigerar inte bort)
    closeMobileNav();  // Stänger menyn när login länken klickas
    openLoginForm(); // Öppnar inloggningsformuläret
});

// Funktion för att stänga menyn
function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.style.display = 'none';  // Döljer menyn
}

// Ladda header och footer när sidan är klar
function loadHeaderAndFooter() {
    console.log('[scripts.js] Loading header and footer.');
    fetch('/partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            console.log('[scripts.js] Header loaded.');

            checkLoginStatus();
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

// Kolla om användaren är inloggad och visa rätt länkar
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
