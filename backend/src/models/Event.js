const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: String,
    content: String,
    //votes: Number,
    thumbnail: String,
    category: String,
    date: Date,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},{
    toJSON:{
        virtuals: true
    }
});

EventSchema.virtual("thumbnail_url").get(function() { return this.thumbnail })

module.exports = mongoose.model('Event',EventSchema)