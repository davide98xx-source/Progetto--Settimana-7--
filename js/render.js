export const elementi = {
  formRicerca: document.querySelector("#form-ricerca"),
  inputSquadra: document.querySelector("#input-squadra"),
  spinner: document.querySelector("#spinner"),
  messaggioErrore: document.querySelector("#messaggio-errore"),
  risultatiRicerca: document.querySelector("#risultati-ricerca"),
  listaPreferite: document.querySelector("#lista-preferite"),
  sezioneDettagli: document.querySelector("#dettagli-squadra"),
  titoloSquadra: document.querySelector("#titolo-squadra"),
  prossimiEventi: document.querySelector("#prossimi-eventi"),
  ultimiRisultati: document.querySelector("#ultimi-risultati"),
};

function creaElemento(tag, testo = "", classe = "") {
  const elemento = document.createElement(tag);
  elemento.textContent = testo;
  if (classe) elemento.className = classe;
  return elemento;
}

function creaLogoSquadra(squadra) {
  const frame = creaElemento("div", "", "team-logo-frame");

  if (!squadra.badge) {
    frame.textContent = "⚽";
    return frame;
  }

  const immagine = document.createElement("img");
  immagine.className = "team-logo";
  immagine.src = squadra.badge;
  immagine.alt = `Logo ${squadra.nome}`;
  immagine.loading = "lazy";
  immagine.decoding = "async";
  immagine.addEventListener(
    "error",
    () => {
      immagine.remove();
      frame.textContent = "⚽";
    },
    { once: true },
  );

  frame.append(immagine);
  return frame;
}

function creaCardSquadra(squadra, preferite, onSeleziona, onTogglePreferito) {
  const card = creaElemento("article", "", "card team-card");
  const titolo = creaElemento("h3", squadra.nome);
  const descrizione = creaElemento(
    "p",
    [squadra.sport, squadra.campionato].filter(Boolean).join(" · "),
  );
  const azioni = creaElemento("div", "", "team-actions");

  const bottoneDettagli = creaElemento(
    "button",
    "Eventi e risultati",
    "details-button",
  );
  bottoneDettagli.type = "button";
  bottoneDettagli.addEventListener("click", () => onSeleziona(squadra));

  const bottonePreferito = creaElemento("button", "", "favorite-button");
  const giaSalvata = preferite.some(
    (preferita) => String(preferita.id) === String(squadra.id),
  );

  bottonePreferito.type = "button";
  bottonePreferito.textContent = giaSalvata ? "★" : "☆";
  bottonePreferito.setAttribute("aria-pressed", String(giaSalvata));
  bottonePreferito.setAttribute(
    "aria-label",
    giaSalvata ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti",
  );
  bottonePreferito.title = giaSalvata
    ? "Rimuovi dai preferiti"
    : "Aggiungi ai preferiti";
  bottonePreferito.addEventListener("click", () => onTogglePreferito(squadra));

  azioni.append(bottoneDettagli, bottonePreferito);
  card.append(creaLogoSquadra(squadra), titolo, descrizione, azioni);
  return card;
}

function renderCardSquadre(
  squadre,
  contenitore,
  preferite,
  onSeleziona,
  onTogglePreferito,
) {
  contenitore.replaceChildren();
  squadre.forEach((squadra) => {
    contenitore.append(
      creaCardSquadra(squadra, preferite, onSeleziona, onTogglePreferito),
    );
  });
}

export function mostraCaricamento(attivo) {
  elementi.spinner.hidden = !attivo;
}

export function mostraErrore(testo) {
  elementi.messaggioErrore.textContent = testo;
  elementi.messaggioErrore.hidden = false;
}

export function nascondiErrore() {
  elementi.messaggioErrore.textContent = "";
  elementi.messaggioErrore.hidden = true;
}

export function renderRisultati(
  squadre,
  preferite,
  onSeleziona,
  onTogglePreferito,
) {
  renderCardSquadre(
    squadre,
    elementi.risultatiRicerca,
    preferite,
    onSeleziona,
    onTogglePreferito,
  );
}

export function renderPreferite(preferite, onSeleziona, onTogglePreferito) {
  const contenitore = elementi.listaPreferite;
  contenitore.replaceChildren();

  if (preferite.length === 0) {
    contenitore.append(
      creaElemento("p", "Non hai ancora aggiunto squadre ai preferiti."),
    );
    return;
  }

  renderCardSquadre(
    preferite,
    contenitore,
    preferite,
    onSeleziona,
    onTogglePreferito,
  );
}

export function preparaDettagliSquadra(squadra) {
  elementi.sezioneDettagli.hidden = false;
  elementi.titoloSquadra.textContent = squadra.nome;
  elementi.prossimiEventi.replaceChildren();
  elementi.ultimiRisultati.replaceChildren();
}

function renderListaEventi(
  eventi,
  contenitore,
  messaggioVuoto,
  mostraPunteggio = false,
) {
  contenitore.replaceChildren();

  if (eventi.length === 0) {
    contenitore.append(creaElemento("p", messaggioVuoto));
    return;
  }

  eventi.forEach((evento) => {
    const card = creaElemento("article", "", "event-card");
    const data = evento.ora ? `${evento.data} · ${evento.ora}` : evento.data;
    card.append(creaElemento("h4", evento.nome), creaElemento("p", data));

    const punteggioDisponibile =
      evento.punteggioCasa !== null &&
      evento.punteggioCasa !== undefined &&
      evento.punteggioOspite !== null &&
      evento.punteggioOspite !== undefined;

    if (mostraPunteggio && punteggioDisponibile) {
      const punteggio =
        `${evento.squadraCasa} ${evento.punteggioCasa} - ` +
        `${evento.punteggioOspite} ${evento.squadraOspite}`;
      card.append(creaElemento("p", punteggio));
    }

    contenitore.append(card);
  });
}

export function renderDettagli(dettagli) {
  renderListaEventi(
    dettagli.prossimiEventi,
    elementi.prossimiEventi,
    "Nessun prossimo evento trovato.",
  );
  renderListaEventi(
    dettagli.risultati,
    elementi.ultimiRisultati,
    "Nessun risultato recente trovato.",
    true,
  );
}
