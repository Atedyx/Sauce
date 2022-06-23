const mongoose = require('mongoose'); // on importe mongoose
const uniqueValidator = require('mongoose-unique-validator') // améliore les messages d'erreur lors de l'enregistrement de données uniques.

const userSchema = mongoose.Schema({  //utilisation de la methode Schema pour créer un schema de donné
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema) 