const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const levelSchema = new Schema({
	level: Number,
});

module.exports = mongoose.model("Level", levelSchema);