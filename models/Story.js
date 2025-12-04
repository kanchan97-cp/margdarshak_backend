const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
