const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

// Importera autentiseringsrutter
const authRoutes = require('./routes/auth');

// Läs in miljövariabler från .env
dotenv.config();

// Skapa appen
const app = express();

// Middleware
app.use(express.json());  // För att kunna ta emot JSON från klienten
app.use(cors());          // Aktivera CORS (Cross-Origin Resource Sharing)
app.use(morgan('dev'));   // Logga HTTP-förfrågningar i utvecklingsläge

// Middleware för autentisering (skyddar alla lobbysidor)
function isAuthenticated(req, res, next) {
  let token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Hämta token från headern

  // Om token inte finns i header, kontrollera cookies (för att hantera båda möjliga sätt)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.redirect('/?message=You must be logged in to join a lobby'); // Om inte inloggad, omdirigera
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect('/?message=You must be logged in to join a lobby'); // Om token är ogiltig, omdirigera
    }
    req.user = decoded;  // Lägg till användarinformation i req
    next();  // Fortsätt till nästa middleware eller rutt
  });
}

// Servera statiska filer från 'public' mappen
app.use(express.static('public'));  // Express kommer nu att servera filer från /public

// Anslut till MongoDB utan deprecated options
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB ansluten'))
  .catch((err) => {
    console.error('Fel vid anslutning till MongoDB:', err);
    process.exit(1); // Stänger ner servern om anslutningen misslyckas
  });

// Använd autentiseringsrutter
app.use('/auth', authRoutes);  // Auth-rutter som login, register, logout

// Skydda alla lobbysidor med autentisering (wildcard för alla spel)
app.get('/lobbies/:game/lobby.html', isAuthenticated, (req, res) => {
  const { game } = req.params;  // Hämta speltypen från URL
  const filePath = path.join(__dirname, 'views', 'lobbies', game, 'lobby.html');
  res.sendFile(filePath);  // Skicka den specifika lobbyfilen
});

// Servera index.html från 'views' mappen när användaren besöker hemsidan
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(filePath);  // Skicka filen till klienten
});

// Servera about.html
app.get('/about', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'about.html');
  res.sendFile(filePath);  // Skicka filen till klienten
});

// Servera contact.html
app.get('/contact', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'contact.html');
  res.sendFile(filePath);  // Skicka filen till klienten
});

// Servera games.html
app.get('/games', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'games.html');
  res.sendFile(filePath);  // Skicka filen till klienten
});

// Starta servern
app.listen(config.port, () => {
  console.log(`Servern kör på http://localhost:${config.port}`);
});
