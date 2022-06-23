// on va creer le routeur pour les user

const express = require('express')
const router = express.Router()  // on crée le routeur avec express et la methode Router
const userCtrl = require('../controllers/user')  // userCtrl est utilisé ici donc on l'importe

// dans notre chemin on ne met que la fin , le reste de la route sera déclaré dans l'application
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

// j'exporte mon router pour pouvoir l'utiliser dans mon app.js et definir les routes 
module.exports = router