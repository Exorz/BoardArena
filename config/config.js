// /config/config.js
require('dotenv').config();  // Läs in miljövariabler från .env

const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://johannessonandree:Fiskbulle1a@db.bo2i6.mongodb.net/db?retryWrites=true&w=majority',  // Om ingen miljövariabel finns, använd den hårdkodade URI:n
  port: process.env.PORT || 3000,  // Standardport 5000 om ingen är angiven
  jwtSecret: process.env.JWT_SECRET || '9399891', // För JWT-autentisering
};

module.exports = config;
