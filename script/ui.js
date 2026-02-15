import { init, getAllInfo, getOpponentEquipeId, calculPuissanceJoueur, getEquipeStats, startMatch, currentMenu, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS, STATS_MATCH, mapMatches } from "./main.js";

function add_btn(id, text) {
    const btnElement = document.getElementsByClassName("button-right")[0];
    const newBtn = document.createElement("button");
    newBtn.id = id;
    newBtn.className = "Ma-team-btn";
    newBtn.innerText = text;
    newBtn.onclick = () => changer_page(id);
    btnElement.appendChild(newBtn);
}

function clear_btn() {
    const btnElement = document.getElementsByClassName("button-right")[0];
    while (btnElement.firstChild) {
        btnElement.removeChild(btnElement.firstChild);
    }
}

async function changer_page(pageOrEvent) {
    const pageId = typeof pageOrEvent === "string" ? pageOrEvent : pageOrEvent?.target?.id;
    // document.getElementById("action-team").style.display = "none";
    // document.getElementById("action-match").style.display = "none";
    // document.getElementById("action-stats").style.display = "none";
    if (!pageId) {
        console.error("Aucun identifiant de page fourni");
        return;
    }
    switch (pageId) {
        case "page-accueil":
            currentMenu.changerPage(new pageACCUEIL());
            // document.getElementById("action-menu").style.display = "block";
            break;
        case "page-equipe":
        case "ma-team":
            currentMenu.changerPage(new pageEQUIPE());
            // document.getElementById("action-team").style.display = "block";
            break;
        case "page-match":
        case "mes-matchs":
            currentMenu.changerPage(new pageMATCH());
            // document.getElementById("action-match").style.display = "block";
            break;
        case "page-stats":
        case "mes-stats":
            currentMenu.changerPage(new pageSTATS());
            // document.getElementById("action-stats").style.display = "block";
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
            const pageMatchResult = {
                nomPage: "Resultat du match",
                titre: "Resultat du match",
                description: `${winnerName} ${match.scoreWinner} : ${match.scoreLoser} ${loserName}`,
                list_btn: [
                    { id: "resultats-matchs", text: "Historique des matchs" },
                    { id: "page-match", text: "Retour aux matchs" },
                ],
                match_result: match,
            };
            currentMenu.changerPage(pageMatchResult);
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
        case "retour":
            currentMenu.changerPage(new pageSTATS());
            break;
        default:
            console.error("Page non reconnue :", pageId);
    }
    document.getElementById('titre_menu').innerText = currentMenu.pageActuelle.titre;
    document.getElementById('phrase').innerText = currentMenu.pageActuelle.description;
    renderPageContent(currentMenu.pageActuelle);

    clear_btn();
    for (const btn of currentMenu.pageActuelle.list_btn) {
        add_btn(btn.id, btn.text);
    }
}

window.changer_page = changer_page;

// Tu peux aussi manipuler le DOM directement ici
document.addEventListener("DOMContentLoaded", () => {
    console.log("L'interface est prête");
});

function renderPageContent(page) {
    const container = document.getElementById("contenu-dynamique");
    if (!container) return;

    container.innerHTML = "";

    if (page?.match_result) {
        const match = page.match_result;
        const winnerName = match.Winner?.nom || "Equipe inconnue";
        const loserName = match.Loser?.nom || "Equipe inconnue";
        const date = new Date(match.date).toLocaleDateString("fr-FR");
        const summary = document.createElement("div");
        summary.className = "match-summary";
        summary.textContent = `${date} - ${winnerName} ${match.scoreWinner} : ${match.scoreLoser} ${loserName}`;
        container.appendChild(summary);

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
        container.appendChild(detailTable);
        return;
    }

    if (Array.isArray(page?.derniers_matchs)) {
        if (page.derniers_matchs.length === 0) {
            container.textContent = "Aucun match a afficher.";
            return;
        }

        const list = document.createElement("ul");
        list.className = "match-history";

        page.derniers_matchs.forEach((match) => {
            const item = document.createElement("li");
            const winnerName = match.Winner?.nom || "Equipe inconnue";
            const loserName = match.Loser?.nom || "Equipe inconnue";
            const date = new Date(match.date).toLocaleDateString("fr-FR");
            item.textContent = `${date} - ${winnerName} ${match.scoreWinner} : ${match.scoreLoser} ${loserName}`;
            list.appendChild(item);
        });

        container.appendChild(list);
    }
}