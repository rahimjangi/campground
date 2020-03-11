var mongoose = require("mongoose");

var campgroundSchema = mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    Comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            rel: "User"
        },
        username: String
    }
});

//Compyling Schema into the modul
module.exports = mongoose.model("Campground", campgroundSchema);