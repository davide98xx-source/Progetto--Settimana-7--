import { Squadra } from "./classes.js";

const STORAGE_KEY = "sportshub-preferite";

export function caricaPreferite() {
  try {
    const datiSalvati = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(datiSalvati)) return [];

    return datiSalvati.map((dati) => new Squadra(dati));
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
