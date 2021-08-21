const express = require("express");
const expressGraphql = require("express-graphql");
const graphqlHTTP = expressGraphql.graphqlHTTP;
const mongoose = require("mongoose");
const cors = require("cors");

//const schema = require("./schema/schema");
const customsHouseSchema = require("./schema/customsHouseSchema");

const app = express();
app.use(cors());

mongoose.connect("mongodb+srv://David:iwEwadPbl2kMrp3H@cluster0.4g9f2.mongodb.net/GraphQL?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});

mongoose.connection.once("open", () => {
	console.log("db connection");

	app.use("/graphql", graphqlHTTP({
		schema: customsHouseSchema,
		graphiql: true
	}));

	app.listen(4000, () => {
		console.log('listen for stuff on 4000');
	});
});
