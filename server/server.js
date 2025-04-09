const express = require('express');
const cors = require('cors'); // CORS Middleware, um CORS-Probleme zu umgehen
const { getNextTwoDepartures } = require('./api');

const app = express();
const port = 3000;

// CORS aktivieren
app.use(cors());

// Basis-Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API-Route: Liefert die nächsten zwei Abfahrten für einen gegebenen rbl Parameter
app.get('/departures/:rbl', async (req, res) => {
  const rbl = req.params.rbl;
  try {
    const departures = await getNextTwoDepartures(rbl);
    res.json(departures);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Daten' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
