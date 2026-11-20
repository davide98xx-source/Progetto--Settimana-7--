export class Squadra {
  constructor(dati = {}) {
    this.id = dati.id ?? dati.idTeam ?? "";
    this.nome = dati.nome ?? dati.strTeam ?? "Squadra";
    this.sport = dati.sport ?? dati.strSport ?? "";
    this.campionato = dati.campionato ?? dati.strLeague ?? "";
    this.badge = dati.badge ?? dati.strBadge ?? dati.strTeamBadge ?? "";
  }
}

export class Evento {
  constructor(dati = {}) {
    this.id = dati.idEvent || "";
    this.nome = dati.strEvent || "Evento";
    this.data = dati.dateEvent || "Data non disponibile";
    this.ora = dati.strTime || "";
    this.squadraCasa = dati.strHomeTeam || "Casa";
    this.squadraOspite = dati.strAwayTeam || "Trasferta";
    this.punteggioCasa = dati.intHomeScore;
    this.punteggioOspite = dati.intAwayScore;
  }
}
