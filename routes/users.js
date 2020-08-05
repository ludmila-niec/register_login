const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport')

//User Model
const User = require("../models/User");

//login page
router.get("/login", (req, res) => {
    res.render("login");
});

//Login handler
//aca vamos a hacer uso de LocalStrategy
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//logout Handler
router.get('/logout', (req, res) =>{
    //middleware de passport para hacer logout
    req.logOut()
    req.flash('success_msg', 'Finalizaste la sesion')
    res.redirect('/users/login')
})

//register page
router.get("/register", (req, res) => {
    res.render("Register");
});

//register POST request
router.post("/register", async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Por favor completa todos los campos" });
    }

    //password + de 6 caracteres
    if (password.length < 6) {
        errors.push({
            message: "La contraseña debe tener al menos 6 caracteres",
        });
    }

    //check password match
    if (password !== password2) {
        errors.push({ message: "Las contraseñas no coinciden" });
    }

    //checkear si tenemos errores
    if (errors.length > 0) {
        //hay errores
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        //no hay errores. continuar
        //checkear si el usuario ya existe. el metodo 'find' retorna una promise
        User.findOne({ email: email }).then((user) => {
            if (user) {
                //si el usuario existe
                errors.push({
                    message: "El email ingresado ya se encuentra registrado",
                });
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            } else {
                //si no existe el usuario, guardar en la base de datos
                const newUser = new User({
                    name,
                    email,
                    password,
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //todo salio ok con el hash password y se lo asigno al objeto user
                        newUser.password = hash;
                        //guardo el user
                        newUser
                            .save() //promise
                            .then((user) => {
                                req.flash(
                                    "success_msg",
                                    "Registro exitoso! Ahora podes iniciar sesion"
                                );
                                res.redirect("/users/login");
                            })
                            .catch((err) => {
                                console.log(err);
                                req.flash(
                                    "error_msg",
                                    "Ocurrio un error. Intentalo otra vez"
                                );
                            });
                    })
                );
            }
        });
    }
});

module.exports = router;
