const monStockage = localStorage;

monStockage.setItem(
  "Joueur",
  JSON.stringify([{ nom: "Nom", prenom: "Prénom", stats: {} }]),
);
monStockage.setItem(
  "Équipes",
  JSON.stringify([{ nom: "Nom", manager: "Manager", stats: {} }]),
);
monStockage.setItem("Joueurs", JSON.stringify([{ nombre: "Nombre" }]));

const joueur = JSON.parse(monStockage.getItem("Joueur"));
const equipes = JSON.parse(monStockage.getItem("Équipes"));
const joueurs = JSON.parse(monStockage.getItem("Joueurs"));
