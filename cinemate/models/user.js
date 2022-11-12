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
	}
});
// Create the model from the schema and export it
export default mongoose.model('User', userSchema)