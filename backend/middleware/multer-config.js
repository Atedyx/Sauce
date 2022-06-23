const multer = require('multer'); ///  un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP.


const MIME_TYPES = {
  'image/jpg': 'jpg',       
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {  //indique à multer de placer les fichiers dans le dossier images
    callback(null, 'images'); // fonction avec 3 arg, appelle le callback, avec arg null pour dire aucune erreur et ensuite dossier img
  },
  filename: (req, file, callback) => {     // utiliser le nom d'origine, remplacer les espace par des underscor
    const name = file.originalname.split(' ').join('_'); // on laisse le nom de l'img, elimine les espace avec split et join permet de mettre les espace par des _ 
    const extension = MIME_TYPES[file.mimetype]; // utilise le dictionnaire MIME pour trouver lla bonne extension
    callback(null, name + Date.now() + '.' + extension);// on def les parametre du call back donc son nom, ajoute un timestap pour rendre image unique possible, un . et extension fichier
  }
});

module.exports = multer({ storage: storage }).single('image');// on exporte multer en lui passant notre constante storage
// .single indique que l'on va gérer uniquement le téléchargement d'image
