const mongoose = require("mongoose");

const swimmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstUsed: Number
});

const styleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    yearStarted: Number,
    swimmers: [swimmerSchema]
});

mongoose.model("Style", styleSchema, "styles");