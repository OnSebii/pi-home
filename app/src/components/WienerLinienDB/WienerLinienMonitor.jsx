// WienerLinienDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WienerLinienDashboard = () => {
  const [stations, setStations] = useState([]);
  const [departuresMap, setDeparturesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // JSON-Datei mit den Stationen laden
  useEffect(() => {
    axios
      .get('/stations.json')
      .then((response) => {
        setStations(response.data.stations);
      })
      .catch((err) => {
        console.error('Fehler beim Laden der Stationen:', err);
        setError(err);
      });
  }, []);

  // Abfahrten für alle geladene Stationen abrufen
  useEffect(() => {
    if (stations.length === 0) return;

    // Für jede Station den Abfahrts-API-Endpunkt anfragen
    const requests = stations.map((station) =>
      axios
        .get(`http://localhost:3000/departures/${station.id}`)
        .then((response) => ({ id: station.id, departures: response.data }))
        .catch((err) => {
          console.error(`Fehler beim Laden der Daten für Station ${station.id}:`, err);
          return { id: station.id, departures: [] };
        }),
    );

    Promise.all(requests)
      .then((results) => {
        // Ergebnisse als Objekt speichern, station.id als Schlüssel
        const departuresObj = {};
        results.forEach(({ id, departures }) => {
          departuresObj[id] = departures;
        });
        setDeparturesMap(departuresObj);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fehler beim Abrufen der Abfahrten:', err);
        setError(err);
        setLoading(false);
      });
  }, [stations]);

  if (loading) {
    return <div>Lade Abfahrten...</div>;
  }

  if (error) {
    return <div>Fehler: {error.message}</div>;
  }

  return (
    <section id="dashboard">
      <h1>Wiener Linien Abfahrten Dashboard</h1>
      {stations.map((station) => (
        <div key={station.id} style={{ marginBottom: '2rem' }}>
          <h2>
            {station.name} (ID: {station.id})
          </h2>
          {departuresMap[station.id] && departuresMap[station.id].length > 0 ? (
            departuresMap[station.id].map((dep, index) => (
              <p key={index}>
                Linie {dep.line} fährt nach {dep.destination} – Abfahrt in {dep.countdown} Minuten
              </p>
            ))
          ) : (
            <p>Keine Abfahrten gefunden.</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default WienerLinienDashboard;
