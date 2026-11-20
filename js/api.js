import { Squadra, Evento } from "./classes.js";

const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

async function fetchJSON(url, signal) {
  const risposta = await fetch(url, { signal });

  if (!risposta.ok) {
    throw new Error(`Errore API (${risposta.status})`);
  }

  return risposta.json();
}

export async function cercaSquadre(query, signal) {
  const url = `${API_BASE}/searchteams.php?t=${encodeURIComponent(query)}`;
  const dati = await fetchJSON(url, signal);

  return (dati.teams || []).map((datiSquadra) => new Squadra(datiSquadra));
}

export async function caricaDettagli(idTeam, signal) {
  const [datiProssimi, datiRisultati] = await Promise.all([
    fetchJSON(
      `${API_BASE}/eventsnext.php?id=${encodeURIComponent(idTeam)}`,
      signal,
    ),
    fetchJSON(
      `${API_BASE}/eventslast.php?id=${encodeURIComponent(idTeam)}`,
      signal,
    ),
  ]);

  return {
    prossimiEventi: (datiProssimi.events || []).map(
      (datiEvento) => new Evento(datiEvento),
    ),
    risultati: (datiRisultati.results || []).map(
      (datiEvento) => new Evento(datiEvento),
    ),
  };
}
