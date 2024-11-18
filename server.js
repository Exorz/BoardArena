// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
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

// Middleware för sessionhantering
app.use(session({
  secret: 'your-secret-key', // Hela sessionen är krypterad med den här nyckeln
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Ställ in på true om du använder HTTPS
}));

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

// Servera index.html från 'views' mappen när användaren besöker hemsidan
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Starta servern
app.listen(config.port, () => {
  console.log(`Servern kör på http://localhost:${config.port}`);
});
