var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate("Comments").exec(function(error, foundedCampground) {
        if (error) {

            console.log(error);
        } else {
            res.render("./comments/new", { campground: foundedCampground });
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log(error);
            req.redirect("/campgrounds");
        } else {

            Comment.create(req.body.comment, function(error, comment) {
                if (error) {
                    console.log(error);
                } else {
                    // add username and id to momment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    // save comment
                    comment.save();
                    campground.Comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//Edit route comments
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res) {
    campground_id = req.params.id;
    Comment.findById(req.params.comment_id, function(error, foundComment) {
        if (error) {
            res.redirect("back");
        } else {
            console.log(foundComment);
            res.render("./comments/edit", { comment: foundComment, campground_id: campground_id });
        }
    });
});

//Comment update
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment) {
        if (error) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comments destroy routes

router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(error, deletedComment) {
        if (error) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;