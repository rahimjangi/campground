var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user.username + " Authenticated");
        Campground.findById(req.params.id, function(error, foundCampground) {
            if (error) {
                console.log("from log:1001 " + error);
                res.redirect("back");
            } else {
                //Does user own campground
                console.log("before checking user equality: " + req.user._id, foundCampground.author.id);
                if (req.user._id.equals(foundCampground.author.id)) {
                    // res.render("./campgrounds/edit", { campground: foundCampground });
                    next();
                } else {
                    console.log(req.user._id, foundCampground.author.id);
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }

}

middlewareObj.checkCommentsOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, foundComment) {
            if (error) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                if (req.user._id.equals(foundComment.author.id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;