const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Serveur prêt !');
});

// Route qui renvoie une page HTML (utilise old_2/index.html existant)
app.get('/home', (req, res) => {
  const filePath = path.resolve(__dirname, 'old_2', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send('Erreur lors de l envoi de la page HTML');
    }
  });
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