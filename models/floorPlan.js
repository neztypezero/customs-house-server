const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const floorPlanSchema = new Schema({
	name: String,
	img: String,
	roomDescription: String,
	roomCount: Number,
	size: String,
	unit: Number,
	level: Number,
	roomCollectionId: String,
	roomCollectionDescription: String,
});

module.exports = mongoose.model("FloorPlan", floorPlanSchema);