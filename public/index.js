//  ======== Initialisation du stockage local ========


const monStockage = localStorage;
let indexManager = localStorage.getItem("indexManager");
if (indexManager === null) {
  indexManager = 1;
  localStorage.setItem("indexManager", indexManager);
} else {
  indexManager = parseInt(indexManager);
}

const titre_menu = document.getElementById('titre_menu');
const phrase = document.getElementById('phrase');
const imageCurrent = document.getElementById('image-current');
const imageNext = document.getElementById('image-next');

let activeEquipe = null;


const managersJSON = {
  "1":
  {
    nom: "Didier",
    prenom: "DU JARDIN",
    id_equipe: 1,
    stats: { victoires: 10, defaites: 5 },
  },
  "2": {
    nom: "Martin",
    prenom: "Sophie",
    id_equipe: 2,
    stats: { victoires: 8, defaites: 7 },
  },

};

const equipesJSON = {
  1: {
    nom: "Les Bléreaux",
    manager: "Dupont Jean",
    stats: { matchsJoués: 15, victoires: 10, defaites: 5 },
    joueurs: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
  },

  2: {
    nom: "Les Furets",
    manager: "Martin Sophie",
    stats: { matchsJoués: 15, victoires: 8, defaites: 7 },
    joueurs: [
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
    ],
  },
};

const joueursJSON = {
  1:
  {
    nom: "Joueur1",
    poste: "Meneur",
    isjoueurPrincipal: true,
    isBlesse: true,
    stats: {
      points: 18,
      passes: 8,
      interceptions: 3,
      contres: 1,
    },
  },
  2:
  {
    nom: "Joueur2",
    poste: "Pivot",
    isjoueurPrincipal: true,
    isBlesse: true,
    stats: {
      points: 22,
      passes: 2,
      interceptions: 1,
      contres: 4,
    },
  },
  3:
  {
    nom: "Joueur3",
    poste: "Ailier",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 15,
      passes: 4,
      interceptions: 2,
      contres: 2,
    },
  },
  4:
  {
    nom: "Joueur4",
    poste: "Ailier Fort",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 20,
      passes: 3,
      interceptions: 2,
      contres: 3,
    },
  },
  5:
  {
    nom: "Joueur5",
    poste: "Arrière",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 16,
      passes: 5,
      interceptions: 4,
      contres: 0,
    },
  },
  6:
  {
    nom: "Joueur6",
    poste: "Arrière",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 12,
      passes: 6,
      interceptions: 3,
      contres: 1,
    },
  },
  7:
  {
    nom: "Joueur7",
    poste: "Meneur",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 14,
      passes: 7,
      interceptions: 2,
      contres: 2,
    },
  },
  8:
  {
    nom: "Joueur8",
    poste: "Pivot",
    isjoueurPrincipal: false,
    isBlesse: false,  
    stats: {
      points: 19,
      passes: 1,
      interceptions: 1,
      contres: 5,
    },
  },
  9:
  {
    nom: "Joueur9",
    poste: "Ailier",
    isjoueurPrincipal: false,
    isBlesse  : false,
    stats: {
      points: 17,
      passes: 4,
      interceptions: 2,
      contres: 2,
    },
  },
  10:
  {
    nom: "Joueur10",
    poste: "Ailier Fort",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 21,
      passes: 3,
      interceptions: 2,
      contres: 4,
    },
  },
  11:
  {
    nom: "Joueur11",
    poste: "Arrière",
    isjoueurPrincipal: false,
    isblesse: false,
    stats: {
      points: 13,
      passes: 5,
      interceptions: 3,
      contres: 1,
    },
  },
  12:
  {
    nom: "Joueur12",
    poste: "Arrière",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 11,
      passes: 6,
      interceptions: 4,
      contres: 0,
    },
  },
  13:
  {
    nom: "Joueur13",
    poste: "Meneur",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 15,
      passes: 8,
      interceptions: 2,
      contres: 1,
    },
  },
  14:
  {
    nom: "Joueur14",
    poste: "Pivot",
    isjoueurPrincipal: true, 
    isBlesse: false, 
    stats: {
      points: 20,
      passes: 2,
      interceptions: 1,
      contres: 4,
    },
  },
  15:
  {
    nom: "Joueur15",
    poste: "Ailier",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 16,
      passes: 4,
      interceptions: 2,
      contres: 2,
    },
  },
  16:
  {
    nom: "Joueur16",
    poste: "Ailier Fort",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 22,
      passes: 3,
      interceptions: 2,
      contres: 3,
    },
  },
  17:
  {
    nom: "Joueur17",
    poste: "Arrière",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 14,
      passes: 5,
      interceptions: 4,
      contres: 0,
    },
  },
  18:
  {
    nom: "Joueur18",
    poste: "Arrière",
    isjoueurPrincipal: true,
    isBlesse: false,
    stats: {
      points: 13,
      passes: 6,
      interceptions: 3,
      contres: 1,
    },
},
  19:
  {
    nom: "Joueur19",
    poste: "Meneur",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 17,
      passes: 7,
      interceptions: 2,
      contres: 2,
    },
  },
  20:
  {
    nom: "Joueur20",
    poste: "Pivot",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 21,
      passes: 1,
      interceptions: 1,
      contres: 5,
    },
  },
  21:
  {
    nom: "Joueur21",
    poste: "Ailier",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 18,
      passes: 4,
      interceptions: 2,
      contres: 2,
    },
  },
  22:
  {
    nom: "Joueur22",
    poste: "Ailier Fort",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 23,
      passes: 3,
      interceptions: 2,
      contres: 4,
    },
  },
  23:
  {
    nom: "Joueur23",
    poste: "Arrière",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 15,
      passes: 5,
      interceptions: 3,
      contres: 1,
    },
  },
  24:
  {
    nom: "Joueur24",
    poste: "Arrière",
    isjoueurPrincipal: false,
    isBlesse: false,
    stats: {
      points: 12,
      passes: 6,
      interceptions: 4,
      contres: 0,
    },
  },
};


//  ========== Stockage des données dans le localStorage ==========


monStockage.setItem("Managers", JSON.stringify(managersJSON));
monStockage.setItem("Équipes", JSON.stringify(equipesJSON));
monStockage.setItem("Joueurs", JSON.stringify(joueursJSON));



const change_manager_display_name = () => {
  const manager = JSON.parse(monStockage.getItem("Managers"))[indexManager];
  const nom_manager = document.getElementById("nom_manager");
  nom_manager.innerHTML = manager.prenom + " <a class='red-text'>" + manager.nom + "</a>";

  const equipes = JSON.parse(monStockage.getItem("Équipes"));
  activeEquipe = equipes[manager.id_equipe];
};

change_manager_display_name();


const load_url_parameter = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get('page')) || 1;
  load(page);
};

const modify_url_parameter = (page) => {
  const url = new URL(window.location);
  url.searchParams.set('page', page);
  window.history.pushState({}, '', url);
}

load_url_parameter();


function load(page) {
  let newSrc = imageCurrent.src;

  // parcourir tout les bouton dans button-right pour les display none
  document.querySelectorAll('.Ma-team-btn').forEach(btn => btn.style.display = 'none');

  modify_url_parameter(page);

  switch (page) {
    case 1:
      titre_menu.innerHTML = '<a class="red-text">Touquet</a>-26';
      newSrc = "img/basketball.webp";
      phrase.innerHTML = "Gérer votre équipe, planifier des matchs et suivre vos statistiques tout en profitant de l'ambiance unique du Touquet-26 !";
      break;
    case 2:
      titre_menu.innerHTML = 'Ma <a class="red-text">team</a> - ' + activeEquipe.nom;
      newSrc = "img/equipe.png";
      phrase.innerHTML = "Construisez et gérez votre équipe de rêve avec des joueurs talentueux et une stratégie gagnante.";
      document.querySelectorAll('.Ma-team-btn').forEach(btn => btn.style.display = 'inline-block');
      break;
    case 3:
      titre_menu.innerHTML = 'Mes <a class="red-text">matchs</a>';
      newSrc = "img/score.png";
      phrase.innerHTML = "Planifiez et suivez vos matchs pour rester organisé et prêt à affronter vos adversaires.";
      break;
    case 4:
      titre_menu.innerHTML = 'Mes <a class="red-text">stats</a>';
      newSrc = "img/trophes.png";
      phrase.innerHTML = "Analysez vos performances avec des statistiques détaillées pour améliorer votre jeu.";
      break;
  }

  // Préparer la nouvelle image
  imageNext.src = newSrc;
  imageNext.style.opacity = '0';


  // Faire disparaître l'ancienne et apparaître la nouvelle
  setTimeout(() => {
    imageNext.style.opacity = '1';
    imageCurrent.style.opacity = '0';
  }, 10);

  // Swapper les images après la transition
  setTimeout(() => {
    imageCurrent.style.transition = 'none';
    imageCurrent.src = newSrc;
    imageCurrent.style.opacity = '1';
    imageNext.style.opacity = '0';
  }, 550);
}

gerer_joueur = () => {
  window.location.href = "/ma_team?action=gerer_joueur";
}