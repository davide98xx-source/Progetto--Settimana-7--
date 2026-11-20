Sport Hub
Sport Hub è una piccola applicazione web per cercare squadre sportive e consultare rapidamente le informazioni principali: logo, sport, campionato, prossimi eventi e risultati recenti.

I dati vengono recuperati da TheSportsDB, usando la chiave gratuita 123 e la sua API v1.

Funzionalità
Ricerca automatica delle squadre mentre si digita, con una breve attesa per ridurre le richieste.
Ricerca immediata con il pulsante Cerca o premendo Invio.
Visualizzazione delle squadre trovate con logo, sport e campionato.
Sezione Squadre Preferite con aggiunta e rimozione tramite la stella.
Salvataggio dei preferiti nel localStorage del browser: restano disponibili dopo il ricaricamento della pagina sullo stesso browser.
Apertura dei dettagli di una squadra per vedere prossimi eventi e ultimi risultati.
Caricamento in parallelo di eventi e risultati con Promise.all.
Indicatore di caricamento, messaggi di errore e annullamento delle richieste superate.
Layout responsive: una card per riga fino a 576 px, due da 577 a 758 px e tre da 759 px in su.
Effetto hover sulle card, con sollevamento e ombra spostata verso destra e in basso.
Tecnologie
HTML5
CSS3
JavaScript moderno con moduli ES (import / export)
fetch, async / await, Promise.all e localStorage
API v1 gratuita di TheSportsDB
Non sono richieste librerie o dipendenze npm.

Struttura del progetto
sport-hub/
├── index.html
├── style.css
├── README.md
└── js/
    ├── app.js       # Avvio dell'app, ricerca ed eventi dell'interfaccia
    ├── api.js       # Richieste a TheSportsDB
    ├── classes.js   # Classi Squadra ed Evento
    ├── render.js    # Rendering e riferimenti agli elementi HTML
    └── storage.js   # Lettura e salvataggio dei preferiti

    API e limiti
L'app usa gli endpoint v1 di TheSportsDB per cercare squadre e caricare eventi. La disponibilità dei dati e i limiti di richiesta dipendono dal servizio e dal piano API: consulta la documentazione ufficiale per i dettagli aggiornati.
