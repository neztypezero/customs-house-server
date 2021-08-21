const graphql = require("graphql");

const { 
	GraphQLSchema, 
	GraphQLObjectType, 
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
} = graphql;

const Gallery = require("../models/Gallery");

const GalleryType = new GraphQLObjectType({
	name:'Gallery',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		images: { 
			type: new GraphQLList(GalleryImageType),
			resolve(parent, args) {
				return GalleryImage.find({galleryId:parent.id});
			},
		},
	})
});

const GalleryImage = require("../models/GalleryImage");

const GalleryImageType = new GraphQLObjectType({
	name:'GalleryImage',
	fields: () => ({
		id: { type: GraphQLID },
		src: { type: GraphQLString },
		alt: { type: GraphQLString },
		gallery: { 
			type: GalleryType,
			resolve(parent, args) {
				return Gallery.findById(parent.galleryId);
			},
		},
	})
});

const RoomCount = require("../models/RoomCount");

const RoomCountType = new GraphQLObjectType({
	name:'RoomCount',
	fields: () => ({
		id: { type: GraphQLID },
		count: { type: GraphQLInt },
		floorPlans: { 
			type: new GraphQLList(FloorPlanType),
			resolve(parent, args) {
				return FloorPlan.find({roomCount:parent.count});
			},
		},
	})
});

const RoomCollectionLevel = require("../models/RoomCollectionLevel");

const RoomCollectionLevelType = new GraphQLObjectType({
	name:'RoomCollectionLevel',
	fields: () => ({
		id: { type: GraphQLID },
		roomCollectionId: { type: GraphQLID },
		level: { type: GraphQLInt },
		floorPlans: { 
			type: new GraphQLList(FloorPlanType),
			resolve(parent, args) {
				return FloorPlan.find({
					roomCollectionId:parent.roomCollectionId,
					level:parent.level,
				});
			},
		},
	})
});

const RoomCollection = require("../models/RoomCollection");

const RoomCollectionType = new GraphQLObjectType({
	name:'RoomCollection',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		levels: { 
			type: new GraphQLList(RoomCollectionLevelType),
			resolve(parent, args) {
				return RoomCollectionLevel.find({roomCollectionId:parent.id});
			},
		},
	})
});

const FloorPlan = require("../models/FloorPlan");

const FloorPlanType = new GraphQLObjectType({
	name:'FloorPlan',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		img: { type: GraphQLString },
		roomDescription: { type: GraphQLString },
		roomCount: { type: GraphQLInt },
		size: { type: GraphQLString },
		unit: { type: GraphQLInt },
		level: { type: GraphQLInt },
		roomCollection: { 
			type: RoomCollectionType,
			resolve(parent, args) {
				return RoomCollection.findById(parent.roomCollectionId);
			},
		},
		roomCollectionDescription: { type: GraphQLString },
	})
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: () => ({
		galleries: {
			type: GraphQLList(GalleryType),
			resolve(parent, args) {
				return Gallery.find({});
			}
		},
		galleriesByName: {
			type: GraphQLList(GalleryType),
			args: {name:{type:GraphQLString}},
			resolve(parent, args) {
				return Gallery.find({name:args.name});
			}
		},
		roomCollections: {
			type: new GraphQLList(RoomCollectionType),
			resolve(parent, args) {
				return RoomCollection.find({});
			}
		},
		roomsBySuiteType: {
			type: new GraphQLList(RoomCountType),
			resolve(parent, args) {
				return RoomCount.find({});
			}
		},
		roomCollectionsByName: {
			type: new GraphQLList(RoomCollectionType),
			args: {name:{type:GraphQLString}},
			resolve(parent, args) {
				return RoomCollection.find({name:args.name});
			}
		},
		floorPlanByRoomCollection: {
			type: RoomCollectionType,
			args: {roomCollectionId:{type:GraphQLID}},
			resolve(parent, args) {
				return RoomCollection.findById(args.roomCollectionId);
			}
		},
		floorPlan: { 
			type: FloorPlanType,
			args: {name:{type:GraphQLString}},
			resolve(parent, args) {
				return FloorPlan.find({name:args.name});
			}
		},
	})
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		addGallery: { 
			type: GalleryType,
			args: {
				name:{type:new GraphQLNonNull(GraphQLString)},
			},
			resolve(parent, args) {
				let gallery = new Gallery({
					name: args.name,
				});
				return gallery.save();
			}
		},
		addGalleryImage: { 
			type: GalleryImageType,
			args: {
				src:{type:new GraphQLNonNull(GraphQLString)},
				alt:{type:new GraphQLNonNull(GraphQLString)},
				galleryId:{type:new GraphQLNonNull(GraphQLID)},
			},
			resolve(parent, args) {
				let galleryImage = new GalleryImage({
					src: args.src,
					alt: args.alt,
					galleryId: args.galleryId,
				});
				return galleryImage.save();
			}
		},
		addRoomCollectionLevel: { 
			type: RoomCollectionLevelType,
			args: {
				level:{type:new GraphQLNonNull(GraphQLInt)},
				roomCollectionId:{type:new GraphQLNonNull(GraphQLID)},
			},
			resolve(parent, args) {
				let roomCollectionLevel = new RoomCollectionLevel({
					level: args.level,
					roomCollectionId: args.roomCollectionId,
				});
				return roomCollectionLevel.save();
			}
		},
		addRoomCollection: { 
			type: RoomCollectionType,
			args: {
				name:{type:new GraphQLNonNull(GraphQLString)},
			},
			resolve(parent, args) {
				let roomCollection = new RoomCollection({
					name: args.name,
				});
				return roomCollection.save();
			}
		},
		addFloorPlan: { 
			type: FloorPlanType,
			args: {
				name:{type:new GraphQLNonNull(GraphQLString)},
				img:{type:new GraphQLNonNull(GraphQLString)},
				roomDescription:{type:new GraphQLNonNull(GraphQLString)},
				roomCount:{type:new GraphQLNonNull(GraphQLInt)},
				size:{type:new GraphQLNonNull(GraphQLString)},
				unit:{type:new GraphQLNonNull(GraphQLInt)},
				level:{type:new GraphQLNonNull(GraphQLInt)},
				roomCollectionId:{type:new GraphQLNonNull(GraphQLID)},
				roomCollectionDescription:{type:GraphQLString},
			},
			resolve(parent, args) {
				let floorPlan = new FloorPlan({
					name: args.name,
					img: args.img,
					roomDescription: args.roomDescription,
					roomCount: args.roomCount,
					size: args.size,
					unit: args.unit,
					level: args.level,
					roomCollectionId: args.roomCollectionId,
					roomCollectionDescription: args.roomCollectionDescription,
				});
				return floorPlan.save();
			}
		},
		addSuiteType: { 
			type: RoomCountType,
			args: {
				count:{type:new GraphQLNonNull(GraphQLInt)},
			},
			resolve(parent, args) {
				let roomCount = new RoomCount({
					count: args.count,
				});
				return roomCount.save();
			}
		},
	}),
});

/*
mutation {
  addGalleryImage(src:"building_gallery1.jpg", alt:"View of Customs House render from Government and Wharf at night with people walking.", galleryId:"61211d0b022e338569cec120") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"building_gallery2.jpg", alt:"View from above Customs House looking towards litup Parliament buildings at night.", galleryId:"61211d0b022e338569cec120") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"building_gallery3.jpg", alt:"View of Customs House render from Government and Wharf at day with pedestrians and cyclists crossing road.", galleryId:"61211d0b022e338569cec120") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery1.jpg", alt:"interior shot 1.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery2.jpg", alt:"interior shot 2.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery3.jpg", alt:"interior shot 3.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery4.jpg", alt:"interior shot 4.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery5.jpg", alt:"interior shot 5.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery6.jpg", alt:"interior shot 6.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery7.jpg", alt:"interior shot 7.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery8.jpg", alt:"interior shot 8.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"interiors_Gallery9.jpg", alt:"interior shot 9.", galleryId:"61211d17022e338569cec122") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"heritageGallery1.jpg", alt:"Construction taking place in 1914.", galleryId:"61211d22022e338569cec124") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"heritageGallery2.jpg", alt:"large gathering of people in early 1900's inner harbour Victoria with Customs House in the background.", galleryId:"61211d22022e338569cec124") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"heritageGallery3.jpg", alt:"5 early slides of the Customs House", galleryId:"61211d22022e338569cec124") {
    id,
    src,
    alt
  }
}

mutation {
  addGalleryImage(src:"heritageGallery4.jpg", alt:"2 early slides of the Customs House", galleryId:"61211d22022e338569cec124") {
    id,
    src,
    alt
  }
}


mutation {
	addFloorPlan(
		name:"A8",
		img:"203.png",
		roomDescription:"1 bedroom",
		roomCount:1,
		size:"958 sq. ft. ext. 85 sq. ft.",
		unit:203,
		level:2,
		roomCollectionId:"6114ca55d325a91491085fcb",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"B3",
		img:"204.png",
		roomDescription:"1 bedroom & den",
		roomCount:1,
		size:"947 sq. ft.",
		unit:204,
		level:2,
		roomCollectionId:"6114ca55d325a91491085fcb",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"B4",
		img:"205.png",
		roomDescription:"1 bedroom & den",
		roomCount:1,
		size:"950 sq. ft.",
		unit:205,
		level:2,
		roomCollectionId:"6114ca55d325a91491085fcb",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"D2L",
		img:"213.png",
		roomDescription:"2 bedroom/lockoff",
		roomCount:2,
		size:"1435 sq. ft.",
		unit:213,
		level:2,
		roomCollectionId:"6114ca55d325a91491085fcb",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"D1L",
		img:"313.png",
		roomDescription:"2 bedroom/lockoff",
		roomCount:2,
		size:"1372 sq. ft.",
		unit:313,
		level:3,
		roomCollectionId:"6114ca55d325a91491085fcb",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"E1",
		img:"403.png",
		roomDescription:"2 bedroom & den",
		roomCount:2,
		size:"1423 sq. ft. | ext. 74 sq. ft.",
		unit:403,
		level:4,
		roomCollectionId:"6114ca55d325a91491085fcb",
		roomCollectionDescription:"Urban Collection Premium",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"C6",
		img:"404.png",
		roomDescription:"2 bedroom",
		roomCount:2,
		size:"1281 sq. ft. | ext. 145 sq. ft.",
		unit:404,
		level:4,
		roomCollectionId:"6114ca55d325a91491085fcb",
		roomCollectionDescription:"Urban Collection Premium",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"C5",
		img:"502.png",
		roomDescription:"2 bedroom",
		roomCount:2,
		size:"1220 sq. ft. | ext. 74 sq. ft.",
		unit:502,
		level:5,
		roomCollectionId:"6114ca55d325a91491085fcb",
		roomCollectionDescription:"Urban Collection Premium",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"C4",
		img:"603.png",
		roomDescription:"2 bedroom",
		roomCount:2,
		size:"1196 sq. ft. | ext. 228 sq. ft.",
		unit:603,
		level:6,
		roomCollectionId:"6114ca55d325a91491085fcb",
		roomCollectionDescription:"Urban Collection Premium",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"PH1",
		img:"701.png",
		roomDescription:"3 bedroom & family",
		roomCount:3,
		size:"3531 sq. ft. | ext. 548 sq. ft.<br>roof deck 1520 sq. ft.",
		unit:701,
		level:7,
		roomCollectionId:"6114ca55d325a91491085fcb",
		roomCollectionDescription:"Penthouse Collection",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"PH2",
		img:"702.png",
		roomDescription:"3 bedroom & den & family",
		roomCount:3,
		size:"4422 sq. ft. | ext. 596 sq. ft.<br>roof deck 1990 sq. ft.",
		unit:702,
		level:7,
		roomCollectionId:"6114ca55d325a91491085fcb",
		roomCollectionDescription:"Penthouse Collection",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"E4",
		img:"206.png",
		roomDescription:"2 bedroom & family",
		roomCount:2,
		size:"2138 sq. ft. | ext. 108 sq. ft.",
		unit:206,
		level:2,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"E2",
		img:"207.png",
		roomDescription:"2 bedroom & family",
		roomCount:2,
		size:"2160 sq. ft. | ext. 102 sq. ft.",
		unit:207,
		level:2,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"E2",
		img:"209.png",
		roomDescription:"2 bedroom & den",
		roomCount:2,
		size:"1655 sq. ft.",
		unit:209,
		level:2,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"C11",
		img:"211.png",
		roomDescription:"2 bedroom",
		roomCount:2,
		size:"1710 sq. ft.",
		unit:211,
		level:2,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"E2",
		img:"309.png",
		roomDescription:"2 bedroom & den",
		roomCount:2,
		size:"1655 sq. ft.",
		unit:309,
		level:3,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"A7",
		img:"310.png",
		roomDescription:"1 bedroom",
		roomCount:1,
		size:"831 sq. ft.",
		unit:310,
		level:3,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"C11",
		img:"311.png",
		roomDescription:"2 bedroom",
		roomCount:2,
		size:"1710 sq. ft.",
		unit:311,
		level:3,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"E2",
		img:"408.png",
		roomDescription:"2 bedroom & den",
		roomCount:2,
		size:"1655 sq. ft.",
		unit:408,
		level:4,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"C11",
		img:"410.png",
		roomDescription:"2 bedroom",
		roomCount:2,
		size:"1710 sq. ft.",
		unit:410,
		level:4,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"F2",
		img:"501.png",
		roomDescription:"3 bedroom & family",
		roomCount:3,
		size:"2279 sq. ft. | ext. 214 sq. ft.",
		unit:501,
		level:5,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"SPH1",
		img:"601.png",
		roomDescription:"2 bedroom & family",
		roomCount:2,
		size:"2353 sq. ft. | ext. 969 sq. ft.",
		unit:601,
		level:6,
		roomCollectionId:"6114ca76d325a91491085fcd",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"PH1",
		img:"701.png",
		roomDescription:"3 bedroom & family",
		roomCount:3,
		size:"3531 sq. ft. | ext. 548 sq. ft.<br>roof deck 1520 sq. ft.",
		unit:701,
		level:7,
		roomCollectionId:"6114ca76d325a91491085fcd",
		roomCollectionDescription:"Penthouse Collection",
	) {
		id,
		name,
	}
}

mutation {
	addFloorPlan(
		name:"PH2",
		img:"702.png",
		roomDescription:"3 bedroom & den & family",
		roomCount:3,
		size:"4422 sq. ft. | ext. 596 sq. ft.<br>roof deck 1990 sq. ft.",
		unit:702,
		level:7,
		roomCollectionId:"6114ca76d325a91491085fcd",
		roomCollectionDescription:"Penthouse Collection",
	) {
		id,
		name,
	}
}
*/

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});