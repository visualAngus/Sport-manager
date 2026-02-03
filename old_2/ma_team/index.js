let indexManager = localStorage.getItem("indexManager");
if (indexManager === null) {
    indexManager = 1;
    localStorage.setItem("indexManager", indexManager);
} else {
    indexManager = parseInt(indexManager);
}


const change_manager_display_name = () => {
    const manager = JSON.parse(localStorage.getItem("Managers"))[indexManager];
    const nom_manager = document.getElementById("nom_manager");
    nom_manager.innerHTML = manager.prenom + " <a class='red-text'>" + manager.nom + "</a>";

    const equipes = JSON.parse(localStorage.getItem("Équipes"));
    activeEquipe = equipes[manager.id_equipe];
};

change_manager_display_name();



const load = (page) => {
    window.location.href = "/index.html?page=" + page;
}


const affichage_joueurs = () => {
    const menu_affichage_joueurs = document.getElementById("menu_affichage_joueurs");
    let joueurs = JSON.parse(localStorage.getItem("Joueurs"));
    let manager = JSON.parse(localStorage.getItem("Managers"))[indexManager];
    let equipe = JSON.parse(localStorage.getItem("Équipes"))[manager.id_equipe];

    for (let i = 0; i < equipe.joueurs.length; i++) {
        let joueur = joueurs[equipe.joueurs[i]];
        console.log(joueur);
        let joueur_element = document.createElement("div");
        joueur_element.className = "joueur";
        joueur_element.innerHTML = `
                <span class="joueur__nom">${joueur.nom}</span>
                <span class="joueur__poste">${joueur.poste}</span>
                <span class="joueur__principal">${joueur.joueurPrincipal ? "Oui" : "Non"}</span>`
        menu_affichage_joueurs.appendChild(joueur_element); 
    }

}
affichage_joueurs();