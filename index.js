const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir les fichiers statiques depuis `public` à la racine
app.use(express.static(path.join(__dirname, 'public')));

// Garder l'ancien dossier accessible sous /old_2 si besoin
app.use('/old_2', express.static(path.join(__dirname, 'old_2')));

app.get('/', (req, res) => {
  res.send('Serveur prêt !');
});

// Route qui renvoie la page HTML depuis `old_2/index.html`
// Route qui renvoie la page index présente dans `public`
app.get('/page', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send('Erreur lors de l envoi de la page HTML');
    }
  });
});

// Racine: renvoyer `public/index.html`
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(filePath);
});

// Route qui renvoie de la data JSON
app.get('/data', (req, res) => {
  const data = {
    message: 'Voici des données JSON',
    timestamp: Date.now(),
    sample: [1, 2, 3]
  };
  res.json(data);
});

app.listen(port, () => {
  console.log(`Application lancée sur http://localhost:${port}`);
});