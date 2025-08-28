const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title : { type: String, required: true},
    content : { type: String, required: true},
    tags : { type: [String], default: []},
    isPinned : { type: Boolean, default: false},
    userId : {type: String, required: true},
    createdOn: { type: Date, default: new Date().getTime() },
    // New fields for the reminder feature
    reminderTime: { type: Date, default: null }, // Stores the time for the reminder
    reminded: { type: Boolean, default: false } // Tracks if the reminder has been triggered
});

module.exports = mongoose.model('Note', noteSchema);
