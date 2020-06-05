const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    date: () => Date.now(),
    //commentary: String,
    approved: Boolean,
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