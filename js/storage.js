import { Squadra } from "./classes.js";

const STORAGE_KEY = "sportshub-preferite";

export function caricaPreferite() {
  try {
    const dati = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(dati) ? dati.map((item) => new Squadra(item)) : [];
  } catch (errore) {
    console.warn("Impossibile leggere i preferiti:", errore);
    return [];
  }
}

export function salvaPreferite(preferite) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferite));
  } catch (errore) {
    console.warn("Impossibile salvare i preferiti:", errore);
  }
}
