const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomCountSchema = new Schema({
	count: Number,
});

module.exports = mongoose.model("RoomCount", roomCountSchema);