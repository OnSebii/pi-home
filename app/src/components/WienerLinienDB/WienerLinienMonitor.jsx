// WienerLinienMonitor.jsx
import React, { useEffect, useState } from 'react';
import { getNextTwoDepartures } from './api.js';

const WienerLinienMonitor = () => {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daten beim Mounten der Komponente abrufen
  useEffect(() => {
    getNextTwoDepartures(1367)
      .then((data) => {
        setDepartures(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Lade Abfahrten...</div>;
  }

  if (error) {
    return <div>Fehler: {error.message}</div>;
  }

  return (
    <section id="home">
      <h1>Wiener Linien Abfahrten</h1>
      {departures.length > 0 ? (
        <div>
          <h2>
            Linie: {departures[0].line} fährt nach {departures[0].destination}
          </h2>
          {departures.map((dep, index) => (
            <p key={index}>Abfahrt in: {dep.countdown} Minuten</p>
          ))}
        </div>
      ) : (
        <p>Keine Abfahrten gefunden.</p>
      )}
    </section>
  );
};

export default WienerLinienMonitor;
