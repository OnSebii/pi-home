import axios from 'axios';

export async function getNextTwoDepartures(rbl) {
  const API_URL = `https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&rbl=${rbl}`;
  try {
    const response = await axios.get(API_URL);
    const json = response.data;

    // Alle Abfahrten aus allen Monitoren und Linien sammeln
    let departuresList = [];
    json.data.monitors.forEach((monitor) => {
      monitor.lines.forEach((line) => {
        line.departures.departure.forEach((dep) => {
          departuresList.push({
            line: line.name,
            destination: line.towards,
            countdown: dep.departureTime.countdown,
            timePlanned: dep.departureTime.timePlanned,
            timeReal: dep.departureTime.timeReal,
          });
        });
      });
    });

    // Sortiere die Abfahrten nach der verbleibenden Zeit (countdown)
    departuresList.sort((a, b) => a.countdown - b.countdown);
    // Gib die nächsten zwei Abfahrten zurück
    return departuresList.slice(0, 2);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw error;
  }
}
