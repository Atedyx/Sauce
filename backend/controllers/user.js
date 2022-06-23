
const mongoose = require('mongoose'); // Mongoose est un package qui facilite les interactions avec notre base de données MongoDB comme crée des schema

const bcrypt = require('bcrypt'); // permet de hasher le mdp 

const jwt = require('jsonwebtoken') // Les tokens d'authentification permettent aux utilisateurs de ne se connecter qu'une seule fois à leur compte


const User = require('../models/user'); // le schema est utilisé dans nos fonctions donc on l'importe

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // on demande a hasher le password dans le body de la requete
    .then(hash => {                  // retourne une promise , où l'on crée un nouvel utilisateur
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()                    // sauvegarde de l'utlisateur dans la bdd
        .then(() => res.status(201).json({ message: 'Utilisateur crée!' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}



exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })  // avec findOne on cherche un utilisateur ,ici par rapport a son mail
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // on compare le mdp entré et celui dans le body de la requete
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(         // .sign permet d'encoder un nouveau token
              { userId: user._id, },
              'RANDOM_TOKEN_SECRET',  // encodage avec des caractères secrets
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};