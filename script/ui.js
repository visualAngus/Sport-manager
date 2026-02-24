import { init, getAllInfo, getOpponentEquipeId, calculPuissanceJoueur, getEquipeStats, startMatch, changerPosteJoueur, toggleBlessure, toggleTitulaire, changerNomEquipe, lancerEntrainement, MapJoueurs, MapEquipes, currentMenu, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS, STATS_MATCH, GESTION_JOUEURS, GESTION_EQUIPE, pageStatsEquipeOnly, pageStatsJoueursOnly, ENTRAINEMENT, mapMatches, pageMatchResultats, pageAJOUTERJOUEUR, ajouterJoueur } from "./main.js";
import { orm } from "./orm.js";

// Creer un bouton d'action contextuel
function add_btn(id, text) {
    const btnElement = document.getElementsByClassName("button-right")[0];
    const newBtn = document.createElement("button");
    newBtn.id = id;
    newBtn.className = "Ma-team-btn";
    newBtn.innerText = text;
    newBtn.onclick = () => changer_page(id);
    btnElement.appendChild(newBtn);
}

// Nettoyer les boutons d'action precedents
function clear_btn() {
    const btnElement = document.getElementsByClassName("button-right")[0];
    while (btnElement.firstChild) {
        btnElement.removeChild(btnElement.firstChild);
    }
}

// Router vers la page demande et rendre le contenu
async function changer_page(pageOrEvent) {
    let pageId = typeof pageOrEvent === "string" ? pageOrEvent : pageOrEvent?.target?.id;
    if (!pageId) {
        console.error("Aucun identifiant de page fourni");
        return;
    }
    switch (pageId) {
        case "page-accueil":
            currentMenu.changerPage(new pageACCUEIL());
            break;
        case "page-equipe":
        case "ma-team":
            pageId = "ma-team";
            currentMenu.changerPage(new pageEQUIPE());
            break;
        case "page-match":
        case "mes-matchs":
            pageId = "mes-matchs";
            currentMenu.changerPage(new pageMATCH());
            break;
        case "page-stats":
        case "mes-stats":
            pageId = "mes-stats";
            currentMenu.changerPage(new pageSTATS());
            break;
        case "ajouter-joueur":
            currentMenu.changerPage(new pageAJOUTERJOUEUR());
            console.log("Navigué vers la page d'ajout de joueur");
            break;
        case "planifier-match": {
            const { equipe } = getAllInfo();
            const opponentId = getOpponentEquipeId(equipe.id);
            if (!opponentId) {
                currentMenu.changerPage(new pageMATCH());
                break;
            }
            const { match } = await startMatch(equipe.id, opponentId);

            const winnerName = match.Winner?.nom || "Equipe inconnue";
            const loserName = match.Loser?.nom || "Equipe inconnue";

            currentMenu.changerPage(new pageMatchResultats(match));
            break;
        }
        case "resultats-matchs": {
            const { equipe } = getAllInfo();
            const listeMatchs = Array.from(mapMatches.values());
            const nouvellePage = new STATS_MATCH(listeMatchs, equipe.nom);

            currentMenu.changerPage(nouvellePage);
            break;
        }
        case "stats-matchs-recents":
            const { equipe } = getAllInfo();
            const listeMatchs = Array.from(mapMatches.values());
            const nouvellePage = new STATS_MATCH(listeMatchs, equipe.nom);

            currentMenu.changerPage(nouvellePage);
            break;
        case "stats-equipe": {
            const { equipe: equipeStats } = getAllInfo();
            const statsEquipe = getEquipeStats(equipeStats.id);
            const pageStatsEquipe = new pageStatsEquipeOnly(equipeStats, statsEquipe);
            currentMenu.changerPage(pageStatsEquipe);
            break;
        }
        case "stats-joueurs": {
            const { equipe: equipeJoueurs } = getAllInfo();
            const pageStatsJoueurs = new pageStatsJoueursOnly(equipeJoueurs.listeJoueurs);
            currentMenu.changerPage(pageStatsJoueurs);
            break;
        }
        case "gerer-joueurs": {
            const { equipe: equipeGestion } = getAllInfo();
            console.log("Equipe pour gestion des joueurs :", equipeGestion);
            const pageGestionJoueurs = new GESTION_JOUEURS(equipeGestion.listeJoueurs);
            currentMenu.changerPage(pageGestionJoueurs);
            break;
        }
        case "gerer-equipe": {
            const { equipe: equipeGestion } = getAllInfo();
            const stats = getEquipeStats(equipeGestion.id);
            const pageGestionEquipe = new GESTION_EQUIPE(equipeGestion, stats);
            currentMenu.changerPage(pageGestionEquipe);
            break;
        }
        case "entrainer": {
            const { equipe: equipeEntrainement } = getAllInfo();
            const resultats = await lancerEntrainement(equipeEntrainement.id);
            const pageEntrainement = new ENTRAINEMENT(resultats);
            currentMenu.changerPage(pageEntrainement);
            break;
        }
        case "retour":
            currentMenu.changerPage(new pageSTATS());
            break;
        default:
            console.error("Page non reconnue :", pageId);
    }
    document.getElementById('titre_menu').innerHTML = currentMenu.pageActuelle.titre;
    document.getElementById('phrase').innerHTML = currentMenu.pageActuelle.description;
    // mettre la classe selected sur le bouton actif enfant de .menu
    const menuButtons = document.querySelectorAll(".menu button");
    menuButtons.forEach((btn) => {
        // console.log(`Comparing button id "${btn.id}" with pageId "${pageId}"`);
        if (btn.id === pageId) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });
    renderPageContent(currentMenu.pageActuelle);

    clear_btn();
    for (const btn of currentMenu.pageActuelle.list_btn) {
        add_btn(btn.id, btn.text);
    }
}

// Exposer la navigation aux boutons HTML
window.changer_page = changer_page;
changer_page("page-accueil");

// Initialiser l'interface au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("L'interface est prête");

    // changer le nom du manager
});
const { manager } = getAllInfo();
if (manager) {
    const managerNameElement = document.getElementById("nom_manager");
    if (managerNameElement) {
        managerNameElement.textContent = `${manager.nom} ${manager.prenom}`;
    }
}

// Rendre le contenu d'une page dans le conteneur dynamique
function renderPageContent(page) {
    const container = document.getElementById("contenu-dynamique");
    if (!container) return;

    container.innerHTML = "";
    container.classList.remove("page-overlay");

    // Afficher la gestion des joueurs en overlay
    if (Array.isArray(page?.listeJoueurs) && !page?.readOnly) {
        container.classList.add("page-overlay");
        const overlay = document.createElement("div");
        overlay.className = "team-overlay";

        const panel = document.createElement("div");
        panel.className = "team-overlay__panel";
        panel.innerHTML = `
            <div class="team-overlay__header">
                <span class="team-overlay__kicker">Gestion</span>
                <h3 class="team-overlay__title">${page.titre}</h3>
                <p class="team-overlay__desc">${page.description}</p>
            </div>
        `;

        const table = document.createElement("table");
        table.className = "player-list";
        table.innerHTML = `<thead>
            <tr>
                <th>Nom</th>
                <th>Poste</th>
                <th>Statut</th>
                <th>Puissance</th>
                <th>Actions</th>
            </tr>
        </thead>`;

        const tbody = document.createElement("tbody");
        page.listeJoueurs.forEach((joueur) => {
            const row = document.createElement("tr");
            row.dataset.joueurId = joueur.id;
            const puissance = Math.round(calculPuissanceJoueur(joueur.id));
            const statut = joueur.isBlesse ? "Blessé" : (joueur.isjoueurPrincipal ? "Titulaire" : "Remplacant");
            console.log(`Rendu du joueur`, joueur);
            row.innerHTML = `
                <td>${joueur.nom}</td>
                <td>
                    <select data-joueur-id="${joueur.id}" data-action="change-poste">
                        <option value="meneur" ${joueur.poste.poste.toLowerCase() === "meneur" ? "selected" : ""}>Meneur</option>
                        <option value="arrière" ${joueur.poste.poste.toLowerCase() === "arrière" ? "selected" : ""}>Arrière</option>
                        <option value="ailier" ${joueur.poste.poste.toLowerCase() === "ailier" ? "selected" : ""}>Ailier</option>
                        <option value="ailier fort" ${joueur.poste.poste.toLowerCase() === "ailier fort" ? "selected" : ""}>Ailier Fort</option>
                        <option value="pivot" ${joueur.poste.poste.toLowerCase() === "pivot" ? "selected" : ""}>Pivot</option>
                    </select>
                </td>
                <td>${statut}</td>
                <td>${puissance}</td>
                <td class="player-actions">
                    <button data-joueur-id="${joueur.id}" data-action="toggle-titulaire">${joueur.isjoueurPrincipal ? "Remplacant" : "Titulaire"}</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        const tableScroll = document.createElement("div");
        tableScroll.className = "table-scroll table-scroll--players";
        tableScroll.appendChild(table);
        panel.appendChild(tableScroll);
        overlay.appendChild(panel);
        container.appendChild(overlay);

        const updateJoueurRow = (joueurId) => {
            const joueur = MapJoueurs.get(joueurId);
            const row = container.querySelector(`tr[data-joueur-id="${joueurId}"]`);
            if (!row || !joueur) return;

            const puissance = Math.round(calculPuissanceJoueur(joueur.id));
            const statut = joueur.isBlesse ? "Blessé" : (joueur.isjoueurPrincipal ? "Titulaire" : "Remplaçant");

            row.innerHTML = `
                <td>${joueur.nom}</td>
                <td>
                    <select data-joueur-id="${joueur.id}" data-action="change-poste">
                        <option value="meneur" ${joueur.poste.poste.toLowerCase() === "meneur" ? "selected" : ""}>Meneur</option>
                        <option value="arrière" ${joueur.poste.poste.toLowerCase() === "arrière" ? "selected" : ""}>Arrière</option>
                        <option value="ailier" ${joueur.poste.poste.toLowerCase() === "ailier" ? "selected" : ""}>Ailier</option>
                        <option value="ailier fort" ${joueur.poste.poste.toLowerCase() === "ailier fort" ? "selected" : ""}>Ailier Fort</option>
                        <option value="pivot" ${joueur.poste.poste.toLowerCase() === "pivot" ? "selected" : ""}>Pivot</option>
                    </select>
                </td>
                <td>${statut}</td>
                <td>${puissance}</td>
                <td class="player-actions">
                    <button data-joueur-id="${joueur.id}" data-action="toggle-titulaire">${joueur.isjoueurPrincipal ? "Remplaçant" : "Titulaire"}</button>
                </td>
            `;
        };

        container.addEventListener("click", async (e) => {
            if (e.target.tagName === "BUTTON") {
                const joueurId = parseInt(e.target.dataset.joueurId);
                const action = e.target.dataset.action;

                if (action === "toggle-blessure") {
                    await toggleBlessure(joueurId);
                    updateJoueurRow(joueurId);
                } else if (action === "toggle-titulaire") {
                    await toggleTitulaire(joueurId);
                    updateJoueurRow(joueurId);
                }
            }
        });

        container.addEventListener("change", async (e) => {
            if (e.target.tagName === "SELECT" && e.target.dataset.action === "change-poste") {
                const joueurId = parseInt(e.target.dataset.joueurId);
                const nouveauPoste = e.target.value;

                await changerPosteJoueur(joueurId, nouveauPoste);
                updateJoueurRow(joueurId);
            }
        });

        return;
    }

    // Afficher les stats d'equipe et la gestion du nom
    if (page?.equipe) {
        const equipe = page.equipe;
        const stats = page.stats;
        const isGestionEquipe = !page.readOnly && page.nomPage === "Gestion de l'Équipe";

        const statsCard = document.createElement("div");
        statsCard.className = "team-stats-card";
        statsCard.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Matchs joués</span>
                <span class="stat-value">${stats.matchsJoues}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Victoires</span>
                <span class="stat-value">${stats.victoires}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Défaites</span>
                <span class="stat-value">${stats.matchsJoues - stats.victoires}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Puissance moyenne</span>
                <span class="stat-value">${Math.round(stats.puissanceMoyenne)}</span>
            </div>
        `;
        if (isGestionEquipe) {
            container.classList.add("page-overlay");
            const overlay = document.createElement("div");
            overlay.className = "team-overlay";

            const panel = document.createElement("div");
            panel.className = "team-overlay__panel";
            panel.innerHTML = `
                <div class="team-overlay__header">
                    <span class="team-overlay__kicker">Gestion</span>
                    <h3 class="team-overlay__title">${page.titre}</h3>
                    <p class="team-overlay__desc">${page.description}</p>
                </div>
            `;

            panel.appendChild(statsCard);
            overlay.appendChild(panel);
            container.appendChild(overlay);
        } else {
            const panel = document.createElement("div");
            panel.className = "team-panel";
            panel.appendChild(statsCard);
            container.appendChild(panel);
        }

        // Ne montrer la section de modification du nom que pour GESTION_EQUIPE (pas readOnly)
        if (!page.readOnly) {
            const nameSection = document.createElement("div");
            nameSection.className = "team-name-section";
            nameSection.innerHTML = `
                <label for="team-name">Nom de l'équipe</label>
                <div class="team-name-edit">
                    <input type="text" id="team-name" value="${equipe.nom}" />
                    <button id="save-team-name">Sauvegarder</button>
                </div>
            `;
            const targetPanel = container.querySelector(".team-overlay__panel") || container.querySelector(".team-panel");
            if (targetPanel) {
                targetPanel.appendChild(nameSection);
            } else {
                container.appendChild(nameSection);
            }

            container.querySelector("#save-team-name").addEventListener("click", async () => {
                const input = container.querySelector("#team-name");
                const nouveauNom = input.value.trim();
                if (nouveauNom && nouveauNom !== equipe.nom) {
                    await changerNomEquipe(equipe.id, nouveauNom);
                    changer_page("gerer-equipe");
                }
            });
        }

        return;
    }

    // Afficher les stats des joueurs en lecture seule
    if (page?.readOnly && Array.isArray(page?.listeJoueurs)) {
        const table = document.createElement("table");
        table.className = "player-list";
        table.innerHTML = `<thead>
            <tr>
                <th>Nom</th>
                <th>Poste</th>
                <th>Statut</th>
                <th>Puissance</th>
                <th>Force</th>
                <th>Vitesse</th>
                <th>Endurance</th>
                <th>Technique</th>
                <th>Points</th>
                <th>Passes</th>
                <th>Interceptions</th>
                <th>Contres</th>
            </tr>
        </thead>`;

        const tbody = document.createElement("tbody");
        page.listeJoueurs.forEach((joueur) => {
            const row = document.createElement("tr");
            const puissance = Math.round(calculPuissanceJoueur(joueur.id));
            const statut = joueur.isBlesse ? "Blessé" : (joueur.isjoueurPrincipal ? "Titulaire" : "Remplacant");

            row.innerHTML = `
                <td>${joueur.nom}</td>
                <td>${joueur.poste.poste}</td>
                <td>${statut}</td>
                <td>${puissance}</td>
                <td>${joueur.force}</td>
                <td>${joueur.vitesse}</td>
                <td>${joueur.endurance}</td>
                <td>${joueur.technique}</td>
                <td>${joueur.points}</td>
                <td>${joueur.passes}</td>
                <td>${joueur.interceptions}</td>
                <td>${joueur.contres}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        return;
    }

    // Afficher le resultat d'un match
    if (page?.match_result) {
        container.classList.add("page-overlay");

        const overlay = document.createElement("div");
        overlay.className = "team-overlay";

        const panel = document.createElement("div");
        panel.className = "team-overlay__panel";
        panel.innerHTML = `
            <div class="team-overlay__header">
                <span class="team-overlay__kicker">Match</span>
                <h3 class="team-overlay__title">${page.titre}</h3>
                <p class="team-overlay__desc">${page.description}</p>
            </div>
        `;

        const match = page.match_result;
        const winnerName = match.Winner?.nom || "Equipe inconnue";
        const loserName = match.Loser?.nom || "Equipe inconnue";
        const date = new Date(match.date).toLocaleDateString("fr-FR");
        const summary = document.createElement("div");
        summary.className = "match-summary";
        summary.innerHTML = `
            <span class="match-date">${date}</span>
            <span class="match-score">${winnerName} <a class="red-text">${match.scoreWinner}</a> : <a class="red-text">${match.scoreLoser}</a> ${loserName}</span>
        `;
        panel.appendChild(summary);

        const detailTable = document.createElement("table");
        detailTable.className = "match-detail";
        detailTable.innerHTML = "<thead><tr><th>Equipe</th><th>1 point</th><th>2 points</th><th>3 points</th></tr></thead>";

        const tbody = document.createElement("tbody");
        const equipes = [match.Winner, match.Loser].filter(Boolean);
        equipes.forEach((equipe) => {
            const details = match.scoreDetail?.[equipe.id] || { "1_point": 0, "2_points": 0, "3_points": 0 };
            const row = document.createElement("tr");
            row.innerHTML = `<td>${equipe.nom}</td><td>${details["1_point"]}</td><td>${details["2_points"]}</td><td>${details["3_points"]}</td>`;
            tbody.appendChild(row);
        });

        detailTable.appendChild(tbody);
        panel.appendChild(detailTable);
        overlay.appendChild(panel);
        container.appendChild(overlay);
        return;
    }

    // Afficher les resultats d'entrainement
    if (Array.isArray(page?.resultatsEntrainement)) {
        container.classList.add("page-overlay");

        const overlay = document.createElement("div");
        overlay.className = "team-overlay";

        const panel = document.createElement("div");
        panel.className = "team-overlay__panel";
        panel.innerHTML = `
            <div class="team-overlay__header">
                <span class="team-overlay__kicker">Entraînement</span>
                <h3 class="team-overlay__title">${page.titre}</h3>
                <p class="team-overlay__desc">${page.description}</p>
            </div>
        `;

        if (page.resultatsEntrainement.length === 0) {
            const empty = document.createElement("div");
            empty.className = "training-empty";
            empty.textContent = "Aucun joueur disponible pour l'entraînement.";
            panel.appendChild(empty);
            overlay.appendChild(panel);
            container.appendChild(overlay);
            return;
        }

        const table = document.createElement("table");
        table.className = "training-results";
        table.innerHTML = `<thead>
            <tr>
                <th>Joueur</th>
                <th>Progressions</th>
            </tr>
        </thead>`;

        const tbody = document.createElement("tbody");
        page.resultatsEntrainement.forEach((resultat) => {
            const row = document.createElement("tr");
            const joueur = resultat.joueur;
            const progressions = resultat.progressions;

            const progressionsList = Object.entries(progressions).map(([stat, data]) => {
                const statLabel = {
                    force: "Force",
                    vitesse: "Vitesse",
                    endurance: "Endurance",
                    technique: "Technique"
                }[stat] || stat;
                return `<span class="progression">${statLabel}: ${data.avant} → ${data.apres} <span class="gain">(+${data.gain})</span></span>`;
            }).join("");

            row.innerHTML = `
                <td class="player-name">${joueur.nom}</td>
                <td class="progressions-list">${progressionsList}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        const tableScroll = document.createElement("div");
        tableScroll.className = "table-scroll table-scroll--training";
        tableScroll.appendChild(table);
        panel.appendChild(tableScroll);
        overlay.appendChild(panel);
        container.appendChild(overlay);
        return;
    }

    // Afficher l'historique des matchs
    if (Array.isArray(page?.derniers_matchs)) {
        container.classList.add("page-overlay");

        const overlay = document.createElement("div");
        overlay.className = "team-overlay";

        const panel = document.createElement("div");
        panel.className = "team-overlay__panel";
        panel.innerHTML = `
            <div class="team-overlay__header">
                <span class="team-overlay__kicker">Matchs</span>
                <h3 class="team-overlay__title">${page.titre}</h3>
                <p class="team-overlay__desc">${page.description}</p>
            </div>
        `;

        if (page.derniers_matchs.length === 0) {
            const empty = document.createElement("div");
            empty.className = "training-empty";
            empty.textContent = "Aucun match a afficher.";
            panel.appendChild(empty);
            overlay.appendChild(panel);
            container.appendChild(overlay);
            return;
        }

        const listWrap = document.createElement("div");
        listWrap.className = "table-scroll";

        const list = document.createElement("ul");
        list.className = "match-history";

        page.derniers_matchs.forEach((match) => {
            const item = document.createElement("li");
            const winnerName = match.Winner?.nom || "Equipe inconnue";
            const loserName = match.Loser?.nom || "Equipe inconnue";
            const date = new Date(match.date).toLocaleDateString("fr-FR");
            item.innerHTML = `
                <span class="match-history__date">${date}</span>
                <span class="match-history__score">${winnerName} ${match.scoreWinner} : ${match.scoreLoser} ${loserName}</span>
            `;
            list.appendChild(item);
        });

        listWrap.appendChild(list);
        panel.appendChild(listWrap);
        overlay.appendChild(panel);
        container.appendChild(overlay);
    }

    if (page?.nomPage === "Ajouter un Joueur") {
        container.classList.add("page-overlay");

        const overlay = document.createElement("div");
        overlay.className = "team-overlay";

        const panel = document.createElement("div");
        panel.className = "team-overlay__panel";
        panel.innerHTML = `
            <div class="team-overlay__header">
                <span class="team-overlay__kicker">Ajouter un Joueur</span>
                <h3 class="team-overlay__title">${page.titre}</h3>
                <p class="team-overlay__desc">${page.description}</p>
            </div>
            <form id="add-player-form" class="add-player-form">
                <label for="player-name">Nom du joueur</label>
                <input type="text" id="player-name" name="player-name" required />
                
                <label for="player-poste">Poste</label>
                <select id="player-poste" name="player-poste" required>
                    <option value="">Sélectionnez un poste</option>
                    <option value="meneur">Meneur</option>
                    <option value="arrière">Arrière</option>
                    <option value="ailier">Ailier</option>
                    <option value="ailier fort">Ailier Fort</option>
                    <option value="pivot">Pivot</option>
                </select>
                
                <button type="submit">Ajouter le joueur</button>
            </form>
        `;

        panel.querySelector("#add-player-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const nameInput = panel.querySelector("#player-name");
            const posteSelect = panel.querySelector("#player-poste");
            const nom = nameInput.value.trim();
            const poste = posteSelect.value;

            if (!nom || !poste) {
                alert("Veuillez remplir tous les champs.");
                return;
            };

            const nouveauJoueurStats = {
                force: Math.floor(Math.random() * 10) + 1,
                vitesse: Math.floor(Math.random() * 10) + 1,
                endurance: Math.floor(Math.random() * 10) + 1,
                technique: Math.floor(Math.random() * 10) + 1
            };

            try {
                const { equipe } = getAllInfo();
                await ajouterJoueur(equipe.id, nom, nouveauJoueurStats.force, nouveauJoueurStats.vitesse, nouveauJoueurStats.endurance, nouveauJoueurStats.technique, poste);
                alert(`Le joueur ${nom} a été ajouté à votre équipe !`);
                changer_page("gerer-joueurs");
            } catch (error) {
                console.error("Erreur lors de l'ajout du joueur :", error);
                alert("Une erreur est survenue lors de l'ajout du joueur. Veuillez réessayer.");
            }

        });

        overlay.appendChild(panel);
        container.appendChild(overlay);

    }
}
