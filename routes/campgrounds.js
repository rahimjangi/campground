var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTS
router.get("/", function(req, res) {

    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log("I could not retrive it");
        } else {
            res.render("./campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//NEW ROUTS
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("./campgrounds/new");
});

//CREATE ROUTS
router.post("/", middleware.isLoggedIn, function(req, res) {
    console.log("Try to create campground 01");
    var campground = req.body.campground;
    campground.author = {
        id: req.user._id,
        username: req.user.username
    };
    console.log("Try to create campground 02 " + campground.author.id, campground.author.username);
    var newCampground = campground;;
    Campground.create(newCampground, function(error, campground) {
        if (error) {
            req.flash("error", "Something is wrong!");
            console.log("We could not save it");
        } else {
            req.flash("success", "Campground added successfully!");
            res.redirect("./campgrounds");
        }
    });
});

//SHOW ROUTS
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("Comments").exec(function(error, foundCampground) {
        if (error) {
            console.log(error);
        } else {
            console.log("foundCampground.author: " + foundCampground.author)
            res.render("./campgrounds/show", { campground: foundCampground });
        }
    });
});

//Edit campground routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground) {
        if (error) {
            res.redirect("back");
        } else {
            res.render("./campgrounds/edit", { campground: foundCampground });
        }
    });
});
//Update campground routes
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground) {
        if (error) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })

});

//Destroy campground rout
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(error, removedCampground) {
        if (error) {
            res.redirect("/campgrounds/");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


//middle ware

module.exports = router;