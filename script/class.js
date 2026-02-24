// Definir les postes possibles et leur validation
class POSTE {
    constructor(poste) {
        this.liste_dispo_poste = [
            "meneur",
            "arrière",
            "ailier",
            "ailier fort",
            "pivot",
        ];
        this.poste = this.verifierPoste(poste);
    }

    verifierPoste(poste) {
        if (this.liste_dispo_poste.includes(poste.toLowerCase())) {
            return poste;
        } else {
            throw new Error("Poste invalide");
        }
    }

    changementPoste(newPoste) {
        this.poste = this.verifierPoste(newPoste);
    }
}

// Definir un joueur et ses statistiques
class JOUEUR {
    constructor(
        id,
        nom,
        poste,
        isjoueurPrincipal,
        isBlesse,
        points,
        passes,
        interceptions,
        contres,
        force,
        vitesse,
        endurance,
        technique,
    ) {
        this.id = id;
        this.nom = nom;
        this.poste = new POSTE(poste);
        this.isjoueurPrincipal = isjoueurPrincipal;
        this.isBlesse = isBlesse;
        this.points = points;
        this.passes = passes;
        this.interceptions = interceptions;
        this.contres = contres;
        this.force = force;
        this.vitesse = vitesse;
        this.endurance = endurance;
        this.technique = technique;
    }

    changementPoste(newPosteName) {
        this.poste.changementPoste(newPosteName);
    }
}

// Definir une equipe et ses performances
class EQUIPE {
    constructor(id, nom, listeJoueurs, manager, matchJoues, victoires) {
        this.id = id;
        this.nom = nom;
        this.listeJoueurs = listeJoueurs;
        this.manager = manager;
        this.matchJoues = matchJoues;
        this.victoires = victoires;
    }
}

// Definir un manager et ses resultats
class MANAGER {
    constructor(id, nom, prenom, idEquipe, victoires, defaites) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.idEquipe = idEquipe;
        this.victoires = victoires;
        this.defaites = defaites;
    }
}

// Definir un match et son detail de score
class MATCH {
    constructor(id, Winner, Loser, date, scoreLoser, scoreWinner, scoreDetail) {
        this.id = id;
        this.Winner = Winner;
        this.Loser = Loser;
        this.date = date;
        this.scoreLoser = scoreLoser;
        this.scoreWinner = scoreWinner;
        this.scoreDetail = scoreDetail;
    }
}

// Construire la page des matchs recents
class STATS_MATCH {
    constructor(liste_matchs_recents, nomMonEquipe) {
        const matchsEquipe = liste_matchs_recents.filter((match) =>
            match.Winner?.nom === nomMonEquipe || match.Loser?.nom === nomMonEquipe,
        );
        const matchsTries = matchsEquipe.sort(
            (a, b) => new Date(a.date) - new Date(b.date),
        );

        this.liste_matchs_recents = matchsTries;
        this.nomPage = "Détails des Matchs";
        this.titre = "<a class='red-text'>Historique</a> des Matchs";
        this.derniers_matchs = matchsTries.slice(-10);
        this.description = this.calculerBilan(nomMonEquipe);
        this.url_image = "img/score.png";
        this.list_btn = [{ id: "retour", text: "Retour" }];
    }
    calculerBilan(nomMonEquipe) {
        let nombreVictoires = 0;
        let nombreDefaites = 0;

        this.derniers_matchs.forEach((match) => {
            if (match.Winner?.nom === nomMonEquipe) {
                nombreVictoires += 1;
            } else if (match.Loser?.nom === nomMonEquipe) {
                nombreDefaites += 1;
            }
        });

        return "Bilan : " + nombreVictoires + "V - " + nombreDefaites + "D";
    }
}

// Construire la page d'accueil
class pageACCUEIL {
    constructor() {
        this.nomPage = "Page d'Accueil";
        this.titre = "<a class='red-text'>N</a>-billet <a class='red-text'>Touquet</a>-26";
        this.description = "<a>Bienvenu dans le <a class='red-text'>gestionnaire de sport ultime.</a>";
        this.url_image = "img/basketball.webp";
        this.list_btn = [
            { id: "page-equipe", text: "Ma page d'équipe" },
            { id: "page-match", text: "Mes matchs" },
            { id: "page-stats", text: "Mes statistiques" },
        ];
    }
}

// Construire la page equipe et ses actions
class pageEQUIPE {
    constructor() {
        this.nomPage = "Page d'Équipe";
        this.titre = "<a class='red-text'>Votre </a> Équipe";
        this.description =
            "Consultez les statistiques de vos joueurs et apportez des modifications.";
        this.url_image = "img/equipe.png";
        this.list_btn = [
            { id: "gerer-joueurs", text: "Gérer mes joueurs" },
            { id: "gerer-equipe", text: "Gérer mon équipe" },
            { id: "entrainer", text: "Lancer un entraînement" },
        ];
    }
}

// Construire la page des matchs
class pageMATCH {
    constructor() {
        this.nomPage = "Page de Match";
        this.titre = "<a class='red-text'> Mes </a> matchs";
        this.description =
            "Préparez-vous pour les prochains affrontements de votre équipe.";
        this.url_image = "img/score.png";
        this.list_btn = [
            { id: "planifier-match", text: "Planifier un match" },
            { id: "resultats-matchs", text: "Résultats des matchs" },
        ];
    }
}

// Construire la page des statistiques
class pageSTATS {
    constructor() {
        this.nomPage = "Page des Stats";
        this.titre = "<a class='red-text'>Mes </a> statistiques";
        this.description =
            "Analysez les performances de votre équipe et de vos joueurs.";
        this.url_image = "img/trophes.png";
        this.list_btn = [
            { id: "stats-equipe", text: "Statistiques de l'équipe" },
            { id: "stats-joueurs", text: "Statistiques des joueurs" },
            { id: "stats-matchs-recents", text: "Historique des matchs" },
        ];
    }
}

// Class de la page pour ajouter un joueur
class pageAJOUTERJOUEUR {
    constructor() {
        this.nomPage = "Ajouter un Joueur";
        this.titre = "<a class='red-text'>Ajouter</a> un nouveau joueur à votre équipe";
        this.description =
            "Remplissez les informations du joueur pour l'ajouter à votre équipe.";
        this.url_image = "img/joueurs.png";
        this.list_btn = [{ id: "page-gestion-joueurs", text: "Retour" }];
    }
}

// Construire la page de gestion des joueurs
class GESTION_JOUEURS {
    constructor(listeJoueurs) {
        this.nomPage = "Gestion des Joueurs";
        this.titre = "<a class='red-text'>Gérer</a> mes joueurs";
        this.description = "Modifier les postes, statuts et titularisations.";
        this.url_image = "img/equipe.png";
        this.list_btn = [{ id: "page-equipe", text: "Retour" },{ id: "ajouter-joueur", text: "Ajouter un joueur" }];
        this.listeJoueurs = listeJoueurs;
    }
}

// Construire la page de gestion d'equipe
class GESTION_EQUIPE {
    constructor(equipe, stats) {
        this.nomPage = "Gestion de l'Équipe";
        this.titre = "<a class='red-text'>Gérer</a> mon équipe";
        this.description = "Modifier le nom et consulter les statistiques.";
        this.url_image = "img/equipe.png";
        this.list_btn = [{ id: "page-equipe", text: "Retour" }];
        this.equipe = equipe;
        this.stats = stats;
    }
}

// Construire la page des resultats d'entrainement
class ENTRAINEMENT {
    constructor(resultatsEntrainement) {
        this.nomPage = "Entraînement";
        this.titre = "<a class='red-text'>Résultats</a> de l'entraînement";
        this.description = "Vos joueurs se sont entraînés et ont progressé !";
        this.url_image = "img/equipe.png";
        this.list_btn = [
            { id: "entrainer", text: "Nouvel entraînement" },
            { id: "page-equipe", text: "Retour" }
        ];
        this.resultatsEntrainement = resultatsEntrainement;
    }
}

// Construire la page stats equipe en lecture seule
class pageStatsEquipeOnly {
    constructor(equipe, stats) {
        this.nomPage = "Statistiques de l'Équipe";
        this.titre = "<a class='red-text'>Statistiques</a> de mon équipe";
        this.description = "Consultez les performances de votre équipe.";
        this.url_image = "img/equipe.png";
        this.list_btn = [{ id: "page-stats", text: "Retour" }];
        this.equipe = equipe;
        this.stats = stats;
        this.readOnly = true;
    }
}

// Construire la page stats joueurs en lecture seule
class pageStatsJoueursOnly {
    constructor(listeJoueurs) {
        this.nomPage = "Statistiques des Joueurs";
        this.titre = "<a class='red-text'>Statistiques</a> de mes joueurs";
        this.description = "Consultez les performances individuelles de vos joueurs.";
        this.url_image = "img/joueurs.png";
        this.list_btn = [{ id: "page-stats", text: "Retour" }];
        this.listeJoueurs = listeJoueurs;
        this.readOnly = true;
    }
}

class pageMatchResultats {
    constructor(match) {
        this.nomPage = "Résultats du Match";
        this.titre = "<a class='red-text'>Résultat</a> du match";
        const winnerName = match?.Winner?.nom || "Inconnu";
        const loserName = match?.Loser?.nom || "Inconnu";
        this.description = match
            ? `Match entre ${winnerName} et ${loserName}`
            : "Aucun match sélectionné.";
        this.url_image = "img/score.png";
        this.list_btn = [
                    { id: "resultats-matchs", text: "Historique des matchs" },
                    { id: "page-match", text: "Retour aux matchs" },
                ];
        this.match_result = match ?? null;
    }
}

// Gerer la navigation entre les pages
class MENU {
    constructor() {
        this.pageActuelle = new pageACCUEIL();
        this.pagesDisponibles = [
            new pageACCUEIL(),
            new pageEQUIPE(),
            new pageMATCH(),
            new pageSTATS(),
            new pageAJOUTERJOUEUR(),
            new GESTION_JOUEURS([]),
            new GESTION_EQUIPE(null, null),
            new ENTRAINEMENT(null),
            new pageStatsEquipeOnly(null, null),
            new pageStatsJoueursOnly([]),
            new pageMatchResultats(null),
        ];
    }
    changerPageByNom(nomPage) {
        const pageTrouvee = this.pagesDisponibles.find(
            (page) => page.nomPage === nomPage,
        );
        if (pageTrouvee) {
            this.pageActuelle = pageTrouvee;
        } else {
            throw new Error("Page non trouvée");
        }
    }
    changerPage(page) {
        this.pageActuelle = page;
    }
}

export {
    POSTE,
    JOUEUR,
    EQUIPE,
    MANAGER,
    MATCH,
    MENU,
    STATS_MATCH,
    GESTION_JOUEURS,
    GESTION_EQUIPE,
    pageStatsEquipeOnly,
    pageStatsJoueursOnly,
    ENTRAINEMENT,
    pageACCUEIL,
    pageEQUIPE,
    pageMATCH,
    pageSTATS,
    pageMatchResultats,
    pageAJOUTERJOUEUR,
};
