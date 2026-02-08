import { init, getAllInfo, calculPuissanceJoueur, getEquipeStats, startMatch, currentMenu, pageACCUEIL, pageEQUIPE, pageMATCH, pageSTATS } from "./main.js";


function changer_page(event) {
    const pageId = event.target.id;
    switch (pageId) {
        case 'page-accueil':
            currentMenu.changerPage(new pageACCUEIL());
            break;
        case 'page-equipe':
            currentMenu.changerPage(new pageEQUIPE());
            break;
        case 'page-match':
            currentMenu.changerPage(new pageMATCH());
            break;
        case 'page-stats':
            currentMenu.changerPage(new pageSTATS());
            break;
        default:
            console.error('Page non reconnue :', pageId);
    }
    document.getElementById('titre-page').innerText = currentMenu.pageActuelle.titre;
    document.getElementById('description-page').innerText = currentMenu.pageActuelle.description;
}

window.changer_page = changer_page;

// Tu peux aussi manipuler le DOM directement ici
document.addEventListener("DOMContentLoaded", () => {
    console.log("L'interface est prête");
});