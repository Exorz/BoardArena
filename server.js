// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');

// Läs in miljövariabler från .env
dotenv.config();

// Skapa appen
const app = express();

// Middleware
app.use(express.json());  // För att kunna ta emot JSON från klienten
app.use(cors());          // Aktivera CORS (Cross-Origin Resource Sharing)
app.use(morgan('dev'));   // Logga HTTP-förfrågningar i utvecklingsläge

// Servera statiska filer från 'public' mappen
app.use(express.static('public'));  // Express kommer nu att servera filer från /public

// Anslut till MongoDB utan deprecated options
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB ansluten'))
  .catch((err) => {
    console.error('Fel vid anslutning till MongoDB:', err);
    process.exit(1); // Stänger ner servern om anslutningen misslyckas
  });

// Definiera rutter
// Start-sida (index)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html'); // Ladda in startsidan
});

// Starta servern
app.listen(config.port, () => {
  console.log(`Servern körs på http://localhost:${config.port}`);
});
