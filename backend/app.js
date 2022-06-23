const express = require('express'); // Express.js utilise les approches de Node.js pour construire des applications web et des API.  
const app = express();  // const apl app qui est notre app et qui contient express
const mongoose = require('mongoose'); // mongoose sert a enregistrer des choses dans bdd ou faire des schema
const bodyParser = require('body-parser') // rend les données du corp exploitable
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path'); // donne acces chemin systeme fichier img

app.use(express.json()); // se middleware intercepte toute les rqt qui contienne de json et les mets a disposition sur l'obj rqt dans req.body



mongoose.connect('mongodb+srv://atedyx28:459b3414@hottake.0sjaq.mongodb.net/HotTake?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
app.use((req, res, next) => { // c'est un midlleware general il sera appliquer a toute les requetes
    res.setHeader('Access-Control-Allow-Origin', '*'); // l'origine qui a le droit d'acceder c'est tlm
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // on donne autorisation d'utiliser certain header sur objet rqt
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // ainsi que certaine methode
    next();
}); // et donc sa permet a l'application d'acceder a l'api sans problème


app.use(bodyParser.json());
app.use('/api/auth', userRoutes); // je lui dit que je veux sur c'est url la 
app.use('/api/sauces', stuffRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;