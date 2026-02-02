const monStockage = localStorage;

monStockage.setItem(
  "Managers",
  JSON.stringify([{ id: "ID", nom: "Nom", prenom: "Prénom", stats: {} }]),
);
monStockage.setItem(
  "Équipes",
  JSON.stringify([{ nom: "Nom", manager: "Manager", stats: {} }]),
);
monStockage.setItem("Joueurs", JSON.stringify([{ liste: "Liste de joueurs" }]));

const manager = JSON.parse(monStockage.getItem("Manager"));
const equipes = JSON.parse(monStockage.getItem("Équipes"));
const joueurs = JSON.parse(monStockage.getItem("Joueurs"));

const managersJSON = {
  liste: [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      stats: { victoires: 10, defaites: 5 },
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      stats: { victoires: 8, defaites: 7 },
    },
  ],
};

const equipesJSON = {
  liste: [
    {
      nom: "Les Bléreaux",
      manager: "Dupont Jean",
      stats: { matchsJoués: 15, victoires: 10, defaites: 5 },
      joueurs: [
        "Joueur1",
        "Joueur2",
        "Joueur3",
        "Joueur4",
        "Joueur5",
        "Joueur6",
      ],
    },
    {
      nom: "Les Furets",
      manager: "Martin Sophie",
      stats: { matchsJoués: 15, victoires: 8, defaites: 7 },
      joueurs: [
        "Joueur7",
        "Joueur8",
        "Joueur9",
        "Joueur10",
        "Joueur11",
        "Joueur12",
      ],
    },
  ],
};

const joueursJSON = {
  liste: [
    {
      nom: "Joueur1",
      poste: "Meneur",
      stats: {
        points: 18,
        passes: 8,
        interceptions: 3,
        contres: 1,
      },
    },
    {
      nom: "Joueur2",
      poste: "Pivot",
      stats: {
        points: 22,
        passes: 2,
        interceptions: 1,
        contres: 4,
      },
    },
    {
      nom: "Joueur3",
      poste: "Ailier",
      stats: {
        points: 15,
        passes: 4,
        interceptions: 2,
        contres: 2,
      },
    },
    {
      nom: "Joueur4",
      poste: "Ailier Fort",
      stats: {
        points: 20,
        passes: 3,
        interceptions: 2,
        contres: 3,
      },
    },
    {
      nom: "Joueur5",
      poste: "Arrière",
      stats: {
        points: 16,
        passes: 5,
        interceptions: 4,
        contres: 0,
      },
    },
    {
      nom: "Joueur6",
      poste: "Arrière",
      stats: {
        points: 12,
        passes: 6,
        interceptions: 3,
        contres: 1,
      },
    },
    {
      nom: "Joueur7",
      poste: "Meneur",
      stats: {
        points: 14,
        passes: 7,
        interceptions: 2,
        contres: 2,
      },
    },
    {
      nom: "Joueur8",
      poste: "Pivot",
      stats: {
        points: 19,
        passes: 1,
        interceptions: 1,
        contres: 5,
      },
    },
    {
      nom: "Joueur9",
      poste: "Ailier",
      stats: {
        points: 17,
        passes: 4,
        interceptions: 2,
        contres: 2,
      },
    },
    {
      nom: "Joueur10",
      poste: "Ailier Fort",
      stats: {
        points: 21,
        passes: 3,
        interceptions: 2,
        contres: 4,
      },
    },
    {
      nom: "Joueur11",
      poste: "Arrière",
      stats: {
        points: 13,
        passes: 5,
        interceptions: 3,
        contres: 1,
      },
    },
    {
      nom: "Joueur12",
      poste: "Arrière",
      stats: {
        points: 11,
        passes: 6,
        interceptions: 4,
        contres: 0,
      },
    },
  ],
};
