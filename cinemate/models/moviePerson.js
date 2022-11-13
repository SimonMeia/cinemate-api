import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const moviePersonSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	}
});
// Create the model from the schema and export it
export default mongoose.model('moviePerson', groupSchema)