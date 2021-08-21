const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const galleryImageSchema = new Schema({
	src: String,
	alt: String,
	galleryId: String,
});

module.exports = mongoose.model("GalleryImage", galleryImageSchema);