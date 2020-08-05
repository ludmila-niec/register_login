const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//passport config
require("./passport")(passport);
dotenv.config();

//connect mongo
mongoose
    .connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err.message);
    });

//bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    //error para mostrar en login
    res.locals.error = req.flash("error");
    next();
});

//view engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server init OK ${PORT} =)`);
});
