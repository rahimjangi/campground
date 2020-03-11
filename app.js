var express = require("express"),
    mongoose = require("mongoose"),
    app = express(),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds");

// seedDB();
//password config
app.use(methodOverride("_method"));
app.use(expressSession({
    secret: "it could be anything you want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

mongoose.connect("mongodb://localhost:27017/campground", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen("5000", function() {
    console.log("Ready to go ...");
});