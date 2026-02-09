import { init, getAllInfo, calculPuissanceJoueur, getEquipeStats, startMatch, currentMenu, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS } from "./main.js";


function changer_page(pageOrEvent) {
    const pageId = typeof pageOrEvent === "string" ? pageOrEvent : pageOrEvent?.target?.id;
    if (!pageId) {
        console.error("Aucun identifiant de page fourni");
        return;
    }
    switch (pageId) {
        case 'page-accueil':
            currentMenu.changerPage(new pageACCUEIL());
            break;
        case 'page-equipe':
        case 'ma-team':
            currentMenu.changerPage(new pageEQUIPE());
            break;
        case 'page-match':
        case 'mes-matchs':
            currentMenu.changerPage(new pageMATCH());
            break;
        case 'page-stats':
        case 'mes-stats':
            currentMenu.changerPage(new pageSTATS());
            break;
        default:
            console.error('Page non reconnue :', pageId);
    }
    document.getElementById('titre_menu').innerText = currentMenu.pageActuelle.titre;
    document.getElementById('phrase').innerText = currentMenu.pageActuelle.description;
}

window.changer_page = changer_page;

// Tu peux aussi manipuler le DOM directement ici
document.addEventListener("DOMContentLoaded", () => {
    console.log("L'interface est prête");   
});