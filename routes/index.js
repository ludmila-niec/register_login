const express = require("express");
const router = express.Router();
//importamos el middleware que checkear si el usuario esta loggeado
const {ensureAuthenticated} = require('../auth')

router.get("/", (req, res) => {
    res.render("welcome");
});
router.get("/dashboard", ensureAuthenticated , (req, res) => {
    console.log(req.user);
    res.render("dashboard", {
        //le podemos pasar informacion del user porque ahora ya esta loggeado y podemos acceder a esa info
        name: req.user.name,
    });
});

module.exports = router;
