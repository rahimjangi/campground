var express = require("express"),
    mongoose = require("mongoose"),
    app = express(),
    bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/campground", { useNewUrlParser: true, useUnifiedTopology: true });

var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//Compyling Schema into the modul
var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX ROUTS
app.get("/campgrounds", function(req, res) {

    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log("I could not retrive it");
        } else {
            res.render("index", { campgrounds: allCampgrounds });
        }
    });
});

//NEW ROUTS
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTS
app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
    var description = "somehbslfnv  jsdfhv ioshd fovih soiudfioawh sdvioug aiuowgd vadouiG WADOIUVG AWOIUG V";
    Campground.create(newCampground, function(error, campground) {
        if (error) {
            console.log("We could not save it");
        } else {
            console.log("Campground added to the database");
            res.redirect("/campgrounds");
        }
    });
});

//SHOW ROUTS
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            res.render("show", { campground: foundCampground });
        }
    });

});


app.listen("5000", function() {
    console.log("Ready to go ...");
});