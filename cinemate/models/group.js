import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const groupSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

groupSchema.set("toJSON", {
	transform: transformJsonUser
});
function transformJsonUser(doc, json, options) {
	// Remove the hashed password from the generated JSON.
	delete json.password;
	return json;
}

// Create the model from the schema and export it
export default mongoose.model('Group', groupSchema)