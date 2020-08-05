const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

//load User model
const User = require('./models/User')

module.exports = (passport) =>{
    passport.use(new LocalStrategy({usernameField:'email'}, (email,password,done) =>{
        //checkear si existe el email ingresado en la DB
        User.findOne({email : email})
        .then(user =>{
            if(!user){
                return done(null, false, {message: 'El email que ingresaste no es valido'})
            }
            //si encontro un mail registrado. Ahora checkear password
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user)
                }else{
                    //si no hubo match
                    return done(null, false, {message: 'Contraseña incorrecta'})
                }
            })
        })
        .catch(err => console.log(err))
    }))

    //serialize and deserialize user
    passport.serializeUser((user, done) =>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) =>{
            done(err, user)
        })
    })
}
