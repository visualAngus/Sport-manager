// Definir un ORM simple pour les besoins de l'application

// Initialiser la base locale et inserer les donnees de depart
async function init() {
  const managersJSON = {
    1: {
      nom: "Didier",
      prenom: "DU JARDIN",
      id_equipe: 1,
      stats: { victoires: 10, defaites: 5 },
    },
    2: {
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
      joueurs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
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
    1: {
      nom: "Jean-Phil LE PANIER", // J'enfile le panier
      poste: "Meneur",
      isjoueurPrincipal: true,
      isBlesse: true,
      stats: { points: 18, passes: 8, interceptions: 3, contres: 1 },
    },
    2: {
      nom: "Yvon LES-SMASH", // Ils vont les smasher
      poste: "Pivot",
      isjoueurPrincipal: true,
      isBlesse: true,
      stats: { points: 22, passes: 2, interceptions: 1, contres: 4 },
    },
    3: {
      nom: "Marc UNPOINT", // Marque un point
      poste: "Ailier",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 15, passes: 4, interceptions: 2, contres: 2 },
    },
    4: {
      nom: "Alain TERCÉPTION", // L'interception
      poste: "Ailier Fort",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 20, passes: 3, interceptions: 2, contres: 3 },
    },
    5: {
      nom: "Sam DUNQUE", // Ça me dunks
      poste: "Arrière",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 16, passes: 5, interceptions: 4, contres: 0 },
    },
    6: {
      nom: "Théo FILET", // T'es au filet
      poste: "Arrière",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 12, passes: 6, interceptions: 3, contres: 1 },
    },
    7: {
      nom: "Justin PTITPOINT", // Juste un petit point
      poste: "Meneur",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 14, passes: 7, interceptions: 2, contres: 2 },
    },
    8: {
      nom: "Gérard MENVUSSA", // J'ai rarement vu ça (pour un grand pivot)
      poste: "Pivot",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 19, passes: 1, interceptions: 1, contres: 5 },
    },
    9: {
      nom: "Aude RAQUETTE", // Eau de raquette
      poste: "Ailier",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 17, passes: 4, interceptions: 2, contres: 2 },
    },
    10: {
      nom: "Hercule DE-BASQUET", // Un classique
      poste: "Ailier Fort",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 21, passes: 3, interceptions: 2, contres: 4 },
    },
    11: {
      nom: "Ali GATO", // Alligator
      poste: "Arrière",
      isjoueurPrincipal: false,
      isblesse: false,
      stats: { points: 13, passes: 5, interceptions: 3, contres: 1 },
    },
    12: {
      nom: "Léo PANIER", // Le haut panier
      poste: "Arrière",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 11, passes: 6, interceptions: 4, contres: 0 },
    },
    13: {
      nom: "Alain TER-VALLES", // À l'intervalle
      poste: "Meneur",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 15, passes: 8, interceptions: 2, contres: 1 },
    },
    14: {
      nom: "Yvon PASSER", // Ils vont passer
      poste: "Pivot",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 20, passes: 2, interceptions: 1, contres: 4 },
    },
    15: {
      nom: "Maud DE PASS", // Mot de passe
      poste: "Ailier",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 16, passes: 4, interceptions: 2, contres: 2 },
    },
    16: {
      nom: "Ray BON", // Rebond
      poste: "Ailier Fort",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 22, passes: 3, interceptions: 2, contres: 3 },
    },
    17: {
      nom: "Kelly BALLE", // Quelle balle
      poste: "Arrière",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 14, passes: 5, interceptions: 4, contres: 0 },
    },
    18: {
      nom: "Sébastien SIFFLET", // C'est bien sifflet
      poste: "Arrière",
      isjoueurPrincipal: true,
      isBlesse: false,
      stats: { points: 13, passes: 6, interceptions: 3, contres: 1 },
    },
    19: {
      nom: "Larry GOLE", // La rigole
      poste: "Meneur",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 17, passes: 7, interceptions: 2, contres: 2 },
    },
    20: {
      nom: "Gilles ÉPARE-BALLES", // Gilet pare-balles (pour la défense)
      poste: "Pivot",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 21, passes: 1, interceptions: 1, contres: 5 },
    },
    21: {
      nom: "Sacha TOUILLE", // Ça chatouille (pour ses interceptions)
      poste: "Ailier",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 18, passes: 4, interceptions: 2, contres: 2 },
    },
    22: {
      nom: "Adam LEVIDE", // À dans le vide
      poste: "Ailier Fort",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 23, passes: 3, interceptions: 2, contres: 4 },
    },
    23: {
      nom: "Zaka POINT", // Y'a qu'à point
      poste: "Arrière",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 15, passes: 5, interceptions: 3, contres: 1 },
    },
    24: {
      nom: "Eddy VERRE", // Divers
      poste: "Arrière",
      isjoueurPrincipal: false,
      isBlesse: false,
      stats: { points: 12, passes: 6, interceptions: 4, contres: 0 },
    },
  };

  // Charger le moteur SQL.js
  const SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
  });

  // Charger une base existante depuis le stockage local
  let db = null;
  const savedData = localStorage.getItem("myDatabase");
  if (savedData) {
    const binaryArray = new Uint8Array(JSON.parse(savedData));
    db = new SQL.Database(binaryArray);
    console.log("Base de données chargée depuis le stockage local");
  } else {
    db = new SQL.Database();
    console.log("Nouvelle base de données créée");
    db.run(
      "CREATE TABLE IF NOT EXISTS JOUEURS (id INTEGER PRIMARY KEY, nom TEXT, poste TEXT, isJoueurPrincipal BOOLEAN, isBlesse BOOLEAN, points INTEGER, passes INTEGER, interceptions INTEGER, contres INTEGER, force INTEGER, endurance INTEGER, technique INTEGER, vitesse INTEGER);",
    );

    // Generer des stats aleatoires autour de 70, bornees entre 0 et 100
    const randomStat = () =>
      Math.min(100, Math.max(0, Math.round(70 + (Math.random() * 60 - 30))));

    // Inserer les donnees des joueurs
    const insertStmt = db.prepare(
      "INSERT INTO JOUEURS (id, nom, poste, isJoueurPrincipal, isBlesse, points, passes, interceptions, contres, force, endurance, technique, vitesse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    );
    for (const [id, joueur] of Object.entries(joueursJSON)) {
      insertStmt.run([
        parseInt(id),
        joueur.nom,
        joueur.poste,
        joueur.isjoueurPrincipal ? 1 : 0,
        joueur.isBlesse || joueur.isblesse ? 1 : 0,
        joueur.stats.points,
        joueur.stats.passes,
        joueur.stats.interceptions,
        joueur.stats.contres,
        randomStat(),
        randomStat(),
        randomStat(),
        randomStat(),
      ]);
    }
    insertStmt.free();
    console.log("Données des joueurs insérées dans la base de données");

    db.run(
      "CREATE TABLE IF NOT EXISTS EQUIPES (id INTEGER PRIMARY KEY, nom TEXT, manager TEXT, matchsJoues INTEGER, victoires INTEGER, defaites INTEGER,joueurs TEXT);",
    );
    // Inserer les donnees des equipes
    const insertEquipeStmt = db.prepare(
      "INSERT INTO EQUIPES (id, nom, manager, matchsJoues, victoires, defaites,joueurs) VALUES (?, ?, ?, ?, ?, ?, ?);",
    );
    for (const [id, equipe] of Object.entries(equipesJSON)) {
      insertEquipeStmt.run([
        parseInt(id),
        equipe.nom,
        equipe.manager,
        equipe.stats.matchsJoués,
        equipe.stats.victoires,
        equipe.stats.defaites,
        JSON.stringify(equipe.joueurs),
      ]);
    }
    insertEquipeStmt.free();
    console.log("Données des équipes insérées dans la base de données");

    db.run(
      "CREATE TABLE IF NOT EXISTS MANAGERS (id INTEGER PRIMARY KEY, nom TEXT, prenom TEXT, id_equipe INTEGER, victoires INTEGER, defaites INTEGER);",
    );
    // Inserer les donnees des managers
    const insertManagerStmt = db.prepare(
      "INSERT INTO MANAGERS (id, nom, prenom, id_equipe, victoires, defaites) VALUES (?, ?, ?, ?, ?, ?);",
    );
    for (const [id, manager] of Object.entries(managersJSON)) {
      insertManagerStmt.run([
        parseInt(id),
        manager.nom,
        manager.prenom,
        manager.id_equipe,
        manager.stats.victoires,
        manager.stats.defaites,
      ]);
    }
    insertManagerStmt.free();
    console.log("Données des managers insérées dans la base de données");

    db.run(
      "CREATE TABLE IF NOT EXISTS MATCHS (id INTEGER PRIMARY KEY, Winner idEQUIPE, Loser idEQUIPE, date TEXT, scoreLoser INTEGER, scoreWinner INTEGER, scoreDetail TEXT);",
    );
  }

  return db;
}

// Persister la base dans le stockage local
async function saveDatabase(db) {
  const binaryArray = db.export();
  localStorage.setItem("myDatabase", JSON.stringify(Array.from(binaryArray)));
  console.log("Base de données sauvegardée dans le stockage local");
}

// Definir les operations CRUD minimales
class ORM {
  constructor(db) {
    this.db = db;
  }
  // Sauvegarder l'etat courant de la base
  saveDatabase() {
    const binaryArray = this.db.export();
    localStorage.setItem("myDatabase", JSON.stringify(Array.from(binaryArray)));
    console.log("Base de données sauvegardée dans le stockage local");
  }

  // Recuperer toutes les lignes d'une table
  selectAll(table) {
    const stmt = this.db.prepare(`SELECT * FROM ${table};`);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  // Recuperer une ligne par identifiant
  selectById(table, id) {
    const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE id = ?;`);
    stmt.bind([id]);
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  }

  // Recuperer une selection par clause WHERE
  selectByWhere(table, whereClause, params) {
    const stmt = this.db.prepare(
      `SELECT * FROM ${table} WHERE ${whereClause};`,
    );
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  // Inserer une nouvelle ligne
  insert(table, data) {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const stmt = this.db.prepare(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders});`,
    );
    stmt.bind(Object.values(data));
    stmt.run();
    stmt.free();
    saveDatabase(this.db);
  }

  // Mettre a jour des colonnes selon un filtre
  update(table, updates, whereClause, params) {
    const setClause = Object.keys(updates)
      .map((col) => `${col} = ?`)
      .join(", ");
    const stmt = this.db.prepare(
      `UPDATE ${table} SET ${setClause} WHERE ${whereClause};`,
    );
    stmt.bind([...Object.values(updates), ...params]);
    stmt.run();
    stmt.free();
    saveDatabase(this.db);
  }
}

// Demarrer l'ORM avec la base locale
const Global_DB = await init();
await saveDatabase(Global_DB);

const orm = new ORM(Global_DB);

export { ORM, orm, saveDatabase };
