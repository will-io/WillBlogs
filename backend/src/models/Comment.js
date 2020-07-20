const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    date: () => Date.now(),
    //commentary: String,
    approved: Boolean,
    owner: String,
    eventTitle: String,
    userEmail: String,
    eventDate: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
});

module.exports = mongoose.model("Comment",CommentSchema);