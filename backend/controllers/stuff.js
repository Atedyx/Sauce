const Sauces = require('../models/Things')
const fs = require('fs'); // Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);// on parse les données envoyés pr pouvoir les utiliser
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on resout chaque segment de l'url
  }); // http ou htpps        recupere host du serv avec img et le nom du fichier 
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce crée' })) // envoie status 201 ok 
    .catch(error => res.status(400).json({ error })); // status 400 error 
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce), // recupere tte info de l'obj
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // genere new img url
    } : { ...req.body }; 
  Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée ' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }))
};

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


exports.likeSauce = (req, res, next) => {

  switch (req.body.like) { // si il y a 0 like
    case 0:
      Sauces.findOne({ _id: req.params.id }) // je vais cherche id 
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauces.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 }, // avec mangodb je dit que je veux -1 like
              $pull: { usersLiked: req.body.userId }, // et supprime le tableau avec pull
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauces.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'ok' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    // S'il y a 1 like
    case 1:
      Sauces.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 }, // ici je dit qu'il y a 1 like
        $push: { usersLiked: req.body.userId }, // et je push 
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Like en +' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    // s'il y a un dislike 
    case -1:
      Sauces.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 }, // 1 dislike
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ok, c\'est ton droit' }) })
        .catch((error) => { res.status(400).json({ error: error }) });
      break;
    default:
      console.error('Error')
  }
};