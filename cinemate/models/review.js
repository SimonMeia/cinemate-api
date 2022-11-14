import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const reviewSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	date: {
		type: Date
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	movie: {
		type: Schema.Types.ObjectId,
		ref: 'Movie'
	}
	// Geoloc
	// Media -> photo
});
// Create the model from the schema and export it
export default mongoose.model('Review', reviewSchema)