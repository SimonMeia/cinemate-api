import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	registrationDate: {
		type: Date
	},
	groups: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Group'
		}],
		default: []
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user'
	},
});

userSchema.set("toJSON", {
	transform: transformJsonUser
});
function transformJsonUser(doc, json, options) {
	// Remove the hashed password from the generated JSON.
	delete json.password;
	return json;
}

// Create the model from the schema and export it
export default mongoose.model('User', userSchema)