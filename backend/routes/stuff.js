const express = require("express");  
const router = express.Router();
const sauceCtrl = require("../controllers/stuff");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); // on importe middleware avec require

router.get("/", auth, sauceCtrl.getAllSauce); // ici j'envoie toute les sauces qui sont dans la bdd
router.post("/", auth, multer, sauceCtrl.createSauce); // ici je crée une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce); // je recupere une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce); // je modifie ma sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce); // supprime la sauce
router.post("/:id/like", auth, sauceCtrl.likeSauce); // like / dislike la sauce

module.exports = router;