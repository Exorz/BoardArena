// /public/js/global.js

// Funktion för att ladda in HTML-filer dynamiskt och lägga in dem på rätt ställen
function loadHTML(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading HTML file:', error);
    });
}

// Ladda in header, navigation och footer på alla sidor
window.onload = function() {
  loadHTML('header-container', '/views/partials/header.html');
  loadHTML('navigation-container', '/views/partials/navigation.html');
  loadHTML('footer-container', '/views/partials/footer.html');
};


