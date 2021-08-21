const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomCollectionLevelSchema = new Schema({
	level: Number,
	roomCollectionId: String,
});

module.exports = mongoose.model("RoomCollectionLevel", roomCollectionLevelSchema);