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
        this.titre = "Historique des Matchs";
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

class pageACCUEIL {
    constructor() {
        this.nomPage = "Page d'Accueil";
        this.titre = "N-billet Touquet-26";
        this.description = "Bienvenu dans le gestionnaire de sport ultime.";
        this.url_image = "img/basketball.webp";
        this.list_btn = [
        ];
    }
}

class pageEQUIPE {
    constructor() {
        this.nomPage = "Page d'Équipe";
        this.titre = "Votre Équipe";
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

class pageMATCH {
    constructor() {
        this.nomPage = "Page de Match";
        this.titre = "Matchs";
        this.description =
            "Préparez-vous pour les prochains affrontements de votre équipe.";
        this.url_image = "img/score.png";
        this.list_btn = [
            { id: "planifier-match", text: "Planifier un match" },
            { id: "resultats-matchs", text: "Résultats des matchs" },
        ];
    }
}

class pageSTATS {
    constructor() {
        this.nomPage = "Page des Stats";
        this.titre = "Statistiques";
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

class GESTION_JOUEURS {
    constructor(listeJoueurs) {
        this.nomPage = "Gestion des Joueurs";
        this.titre = "Gérer mes joueurs";
        this.description = "Modifier les postes, statuts et titularisations.";
        this.url_image = "img/equipe.png";
        this.list_btn = [{ id: "page-equipe", text: "Retour" }];
        this.listeJoueurs = listeJoueurs;
    }
}

class GESTION_EQUIPE {
    constructor(equipe, stats) {
        this.nomPage = "Gestion de l'Équipe";
        this.titre = "Gérer mon équipe";
        this.description = "Modifier le nom et consulter les statistiques.";
        this.url_image = "img/equipe.png";
        this.list_btn = [{ id: "page-equipe", text: "Retour" }];
        this.equipe = equipe;
        this.stats = stats;
    }
}

class ENTRAINEMENT {
    constructor(resultatsEntrainement) {
        this.nomPage = "Entraînement";
        this.titre = "Résultats de l'entraînement";
        this.description = "Vos joueurs se sont entraînés et ont progressé !";
        this.url_image = "img/equipe.png";
        this.list_btn = [
            { id: "entrainer", text: "Nouvel entraînement" },
            { id: "page-equipe", text: "Retour" }
        ];
        this.resultatsEntrainement = resultatsEntrainement;
    }
}

class MENU {
    constructor() {
        this.pageActuelle = new pageACCUEIL();
        this.pagesDisponibles = [
            new pageACCUEIL(),
            new pageEQUIPE(),
            new pageMATCH(),
            new pageSTATS(),
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
    ENTRAINEMENT,
    pageACCUEIL,
    pageEQUIPE,
    pageMATCH,
    pageSTATS,
};
