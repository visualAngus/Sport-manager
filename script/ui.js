import { init, getAllInfo, calculPuissanceJoueur, getEquipeStats, startMatch, currentMenu, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS } from "./main.js";

function add_btn(id,text){
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

function changer_page(pageOrEvent) {
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
        default:
            console.error("Page non reconnue :", pageId);
    }
    document.getElementById('titre_menu').innerText = currentMenu.pageActuelle.titre;
    document.getElementById('phrase').innerText = currentMenu.pageActuelle.description;

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