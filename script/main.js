import { orm } from "./orm.js";
import { POSTE, JOUEUR, EQUIPE, MANAGER, MATCH, MENU, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS, STATS_MATCH, GESTION_JOUEURS, GESTION_EQUIPE, ENTRAINEMENT } from "./class.js";


let MapJoueurs = new Map();
let MapEquipes = new Map();
let MapManagers = new Map();
let mapMatches = new Map();
let currentMenu = new MENU();
const id_manager = 1;


const init = async () => {
    const joueurs = await orm.selectAll('JOUEURS');
    joueurs.forEach(joueurData => {
        const joueur = new JOUEUR(
            joueurData.id,
            joueurData.nom,
            joueurData.poste,
            joueurData.isjoueurPrincipal,
            joueurData.isBlesse,
            joueurData.points,
            joueurData.passes,
            joueurData.interceptions,
            joueurData.contres,
            joueurData.force,
            joueurData.vitesse,
            joueurData.endurance,
            joueurData.technique
        );
        MapJoueurs.set(joueur.id, joueur);
    });


    const equipes = await orm.selectAll('EQUIPES');
    equipes.forEach(equipeData => {
        const joueurIds = JSON.parse(equipeData.joueurs);
        const listeJoueurs = joueurIds.map(id => MapJoueurs.get(parseInt(id)));
        const equipe = new EQUIPE(
            equipeData.id,
            equipeData.nom,
            listeJoueurs,
            equipeData.manager,
            equipeData.matchsJoues,
            equipeData.victoires
        );
        MapEquipes.set(equipe.id, equipe);
    });

    const managers = await orm.selectAll('MANAGERS');
    managers.forEach(managerData => {
        const manager = new MANAGER(
            managerData.id,
            managerData.nom,
            managerData.prenom,
            managerData.id_equipe,
            managerData.victoires,
            managerData.defaites
        );
        MapManagers.set(manager.id, manager);
    });

    const matchs = await orm.selectAll('MATCHS');
    matchs.forEach(matchData => {
        const match = new MATCH(
            matchData.id,
            MapEquipes.get(matchData.Winner),
            MapEquipes.get(matchData.Loser),
            matchData.date,
            matchData.scoreLoser,
            matchData.scoreWinner,
            JSON.parse(matchData.scoreDetail)
        );
        mapMatches.set(match.id, match);
    });

}
await init();


const getAllInfo = () => {
    const manager = MapManagers.get(id_manager);
    const equipe = MapEquipes.get(manager.idEquipe);
    return { manager, equipe };
}

const getOpponentEquipeId = (idEquipe) => {
    for (const equipeId of MapEquipes.keys()) {
        if (equipeId !== idEquipe) {
            return equipeId;
        }
    }
    return null;
}

const calculPuissanceJoueur = (id_joueur) => {
    const joueur = MapJoueurs.get(id_joueur);
    const puissance = (joueur.force + joueur.vitesse + joueur.endurance + joueur.technique) / 4;
    return puissance;
}

const getEquipeStats = (id_equipe) => {
    const equipe = MapEquipes.get(id_equipe);
    // utiliser calculPuissanceJoueur pour chaque joueur de l'équipe
    let totalPuissance = 0;
    equipe.listeJoueurs.forEach(joueur => {
        if (joueur.isBlesse) return;
        if (!joueur.isjoueurPrincipal) return;
        totalPuissance += calculPuissanceJoueur(joueur.id);
    });
    const puissanceMoyenne = totalPuissance / equipe.listeJoueurs.length;
    return {
        matchsJoues: equipe.matchJoues,
        victoires: equipe.victoires,
        puissanceMoyenne: puissanceMoyenne
    };
}

const getMatchWinnerAndScore = (id_equipe1, id_equipe2) => {
    // grace au statistiques et a des valeurs aléatoires, déterminer le gagnant
    const equipe1Stats = getEquipeStats(id_equipe1);
    const equipe2Stats = getEquipeStats(id_equipe2);

    const scoreEquipe1 = (equipe1Stats.victoires / equipe1Stats.matchsJoues) * 0.6 + (equipe1Stats.puissanceMoyenne / 100) * 0.6 + Math.random() * 0.8;
    const scoreEquipe2 = (equipe2Stats.victoires / equipe2Stats.matchsJoues) * 0.6 + (equipe2Stats.puissanceMoyenne / 100) * 0.6 + Math.random() * 0.8;

    if (scoreEquipe1 > scoreEquipe2) {
        return { "winner": id_equipe1, "loser": id_equipe2, "winScore": Math.floor(scoreEquipe1 * 100), "LoseScore": Math.floor(scoreEquipe2 * 100) };
    } else {
        return { "winner": id_equipe2, "loser": id_equipe1, "winScore": Math.floor(scoreEquipe2 * 100), "LoseScore": Math.floor(scoreEquipe1 * 100) };
    }
}

function tiragePondere(valeurs, probas) {
    const r = Math.random();
    let cumul = 0;

    for (let i = 0; i < probas.length; i++) {
        cumul += probas[i];
        if (r < cumul) {
            return valeurs[i];
        }
    }
}


const scoring = (id_equipe, points) => {
    const equipe = MapEquipes.get(id_equipe);
    // établir les règles du basket 
    const listePointsPossibles = [1, 2, 3];
    const listeProbabilites = [0.08, 0.75, 0.07];

    let pointsRestants = points;
    const scoreDetails = {
        "1_point": 0,
        "2_points": 0,
        "3_points": 0
    };

    while (pointsRestants > 0) {
        const pointMarque = tiragePondere(listePointsPossibles, listeProbabilites);
        if (pointMarque <= pointsRestants) {
            pointsRestants -= pointMarque;
            if (pointMarque === 1) scoreDetails["1_point"] += 1;
            else if (pointMarque === 2) scoreDetails["2_points"] += 1;
            else if (pointMarque === 3) scoreDetails["3_points"] += 1;
        }
    }

    return scoreDetails;
}

const startMatch = async (id_equipe1, id_equipe2) => {
    const matchResult = getMatchWinnerAndScore(id_equipe1, id_equipe2);
    const scoreEquipe1 = scoring(id_equipe1, matchResult.winScore);
    const scoreEquipe2 = scoring(id_equipe2, matchResult.LoseScore);

    console.log(matchResult);
    const match = new MATCH(
        Date.now(),
        MapEquipes.get(matchResult.winner),
        MapEquipes.get(matchResult.loser),
        new Date().toISOString(),
        matchResult.LoseScore,
        matchResult.winScore,
        {
            [id_equipe1]: scoreEquipe1,
            [id_equipe2]: scoreEquipe2
        }
    );

    mapMatches.set(match.id, match);
    await orm.insert('MATCHS', {
        id: match.id,
        Winner: match.Winner.id,
        Loser: match.Loser.id,
        date: match.date,
        scoreLoser: match.scoreLoser,
        scoreWinner: match.scoreWinner,
        scoreDetail: JSON.stringify(match.scoreDetail)
    });

    return { match };
}

const afficherHistoriqueMatchs = () => {
    const { equipe } = getAllInfo();
    const tousLesMatchs = Array.from(mapMatches.values());

    const pageStatsDynamique = new STATS_MATCH(tousLesMatchs, equipe.nom);

    currentMenu.changerPage(pageStatsDynamique);

    console.log("Nouvelle page créée :", currentMenu.pageActuelle);
}

const changerPosteJoueur = async (id_joueur, nouveauPoste) => {
    const joueur = MapJoueurs.get(id_joueur);
    if (!joueur) throw new Error("Joueur non trouvé");

    joueur.changementPoste(nouveauPoste);

    await orm.update('JOUEURS', { poste: nouveauPoste }, 'id = ?', [id_joueur]);
}

const toggleBlessure = async (id_joueur) => {
    const joueur = MapJoueurs.get(id_joueur);
    if (!joueur) throw new Error("Joueur non trouvé");

    joueur.isBlesse = !joueur.isBlesse;

    await orm.update('JOUEURS', { isBlesse: joueur.isBlesse ? 1 : 0 }, 'id = ?', [id_joueur]);
}

const toggleTitulaire = async (id_joueur) => {
    const joueur = MapJoueurs.get(id_joueur);
    if (!joueur) throw new Error("Joueur non trouvé");

    joueur.isjoueurPrincipal = !joueur.isjoueurPrincipal;

    await orm.update('JOUEURS', { isjoueurPrincipal: joueur.isjoueurPrincipal ? 1 : 0 }, 'id = ?', [id_joueur]);
}

const changerNomEquipe = async (id_equipe, nouveauNom) => {
    const equipe = MapEquipes.get(id_equipe);
    if (!equipe) throw new Error("Équipe non trouvée");

    equipe.nom = nouveauNom;

    await orm.update('EQUIPES', { nom: nouveauNom }, 'id = ?', [id_equipe]);
}

const lancerEntrainement = async (id_equipe) => {
    const equipe = MapEquipes.get(id_equipe);
    if (!equipe) throw new Error("Équipe non trouvée");

    const resultats = [];
    const statsDisponibles = ['force', 'vitesse', 'endurance', 'technique'];

    for (const joueur of equipe.listeJoueurs) {
        // Les joueurs blessés ne s'entraînent pas
        if (joueur.isBlesse) continue;

        const progressions = {};
        // Chaque joueur progresse dans 1 à 3 stats aléatoires
        const nbStats = Math.floor(Math.random() * 3) + 1;
        const statsAmeliorer = [];
        
        // Sélectionner aléatoirement les stats à améliorer
        while (statsAmeliorer.length < nbStats) {
            const stat = statsDisponibles[Math.floor(Math.random() * statsDisponibles.length)];
            if (!statsAmeliorer.includes(stat)) {
                statsAmeliorer.push(stat);
            }
        }

        // Améliorer chaque stat sélectionnée
        for (const stat of statsAmeliorer) {
            const progression = Math.floor(Math.random() * 5) + 1; // +1 à +5
            const ancienneValeur = joueur[stat];
            const nouvelleValeur = Math.min(100, ancienneValeur + progression);
            joueur[stat] = nouvelleValeur;
            progressions[stat] = {
                avant: ancienneValeur,
                apres: nouvelleValeur,
                gain: nouvelleValeur - ancienneValeur
            };

            // Mettre à jour la DB
            await orm.update('JOUEURS', { [stat]: nouvelleValeur }, 'id = ?', [joueur.id]);
        }

        resultats.push({
            joueur: joueur,
            progressions: progressions
        });
    }

    return resultats;
}

export { init, getAllInfo, getOpponentEquipeId, calculPuissanceJoueur, getEquipeStats, startMatch, changerPosteJoueur, toggleBlessure, toggleTitulaire, changerNomEquipe, lancerEntrainement, MapJoueurs, MapEquipes, currentMenu, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS, STATS_MATCH, GESTION_JOUEURS, GESTION_EQUIPE, ENTRAINEMENT, mapMatches };