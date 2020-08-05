module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            //si esta autenticado puede seguir
            return next();
        }
        //sino esta autenticado mostramos un mensaje
        req.flash("error_msg", "Necesitas iniciar sesion para acceder");
        res.redirect("/users/login");
    },
};

//ahora sepuede utilizar este middleware en cualquier ruta que se quiera proteger