import { cercaSquadre, caricaDettagli } from "./api.js";
import { caricaPreferite, salvaPreferite } from "./storage.js";
import {
  elementi,
  mostraCaricamento,
  mostraErrore,
  nascondiErrore,
  renderRisultati,
  renderPreferite,
  preparaDettagliSquadra,
  renderDettagli,
} from "./render.js";

// === Stato ===

let squadreTrovate = [];
let preferite = caricaPreferite();
let timerRicerca = null;
let controllerAttivo = null;

// === Richieste ===

function annullaRichiestaAttiva() {
  if (!controllerAttivo) {
    return;
  }

  controllerAttivo.abort();
  controllerAttivo = null;
}

function nuovaRichiesta() {
  annullaRichiestaAttiva();
  controllerAttivo = new AbortController();

  return controllerAttivo;
}

function messaggioErroreRichiesta(errore, messaggioGenerico) {
  if (errore.message.includes("(429)")) {
    return "Limite di richieste raggiunto. Attendi un minuto e riprova.";
  }

  return messaggioGenerico;
}

// === Preferiti ===

function aggiornaSquadreMostrate() {
  renderPreferite(preferite, selezionaSquadra, alternaPreferito);
  renderRisultati(
    squadreTrovate,
    preferite,
    selezionaSquadra,
    alternaPreferito,
  );
}

function alternaPreferito(squadra) {
  const giaSalvata = preferite.some(
    (preferita) => String(preferita.id) === String(squadra.id),
  );

  if (giaSalvata) {
    preferite = preferite.filter(
      (preferita) => String(preferita.id) !== String(squadra.id),
    );
  } else {
    preferite.push(squadra);
  }

  salvaPreferite(preferite);
  aggiornaSquadreMostrate();
}

// === Ricerca e dettagli ===

async function eseguiRicerca(query) {
  const controller = nuovaRichiesta();

  squadreTrovate = [];
  renderRisultati([], preferite, selezionaSquadra, alternaPreferito);

  elementi.sezioneDettagli.hidden = true;
  nascondiErrore();
  mostraCaricamento(true);

  try {
    squadreTrovate = await cercaSquadre(query, controller.signal);

    if (controllerAttivo !== controller) {
      return;
    }

    if (squadreTrovate.length === 0) {
      mostraErrore("Nessuna squadra trovata. Prova con un altro nome.");
      return;
    }

    renderRisultati(
      squadreTrovate,
      preferite,
      selezionaSquadra,
      alternaPreferito,
    );
  } catch (errore) {
    if (errore.name === "AbortError") {
      return;
    }

    console.error("Errore durante la ricerca:", errore);
    mostraErrore(
      messaggioErroreRichiesta(
        errore,
        "Errore nel caricamento delle squadre. Riprova.",
      ),
    );
  } finally {
    if (controllerAttivo === controller) {
      controllerAttivo = null;
      mostraCaricamento(false);
    }
  }
}

async function selezionaSquadra(squadra) {
  const controller = nuovaRichiesta();

  preparaDettagliSquadra(squadra);
  nascondiErrore();
  mostraCaricamento(true);

  try {
    const dettagli = await caricaDettagli(squadra.id, controller.signal);

    if (controllerAttivo !== controller) {
      return;
    }

    renderDettagli(dettagli);
  } catch (errore) {
    if (errore.name === "AbortError") {
      return;
    }

    console.error("Errore nel caricamento degli eventi:", errore);
    mostraErrore(
      messaggioErroreRichiesta(
        errore,
        "Non è stato possibile caricare gli eventi della squadra.",
      ),
    );
  } finally {
    if (controllerAttivo === controller) {
      controllerAttivo = null;
      mostraCaricamento(false);
    }
  }
}

// === Eventi dell'interfaccia ===

elementi.inputSquadra.addEventListener("input", () => {
  clearTimeout(timerRicerca);
  annullaRichiestaAttiva();
  mostraCaricamento(false);

  squadreTrovate = [];
  renderRisultati([], preferite, selezionaSquadra, alternaPreferito);

  elementi.sezioneDettagli.hidden = true;
  nascondiErrore();

  const query = elementi.inputSquadra.value.trim();

  if (!query) {
    return;
  }

  timerRicerca = setTimeout(() => {
    eseguiRicerca(query);
  }, 600);
});

elementi.formRicerca.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(timerRicerca);

  const query = elementi.inputSquadra.value.trim();

  if (!query) {
    annullaRichiestaAttiva();
    mostraCaricamento(false);
    squadreTrovate = [];
    renderRisultati([], preferite, selezionaSquadra, alternaPreferito);
    mostraErrore("Inserisci il nome di una squadra.");
    return;
  }

  eseguiRicerca(query);
});

// === Avvio ===

aggiornaSquadreMostrate();
