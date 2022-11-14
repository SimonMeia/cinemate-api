import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const movieSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	posterURL: {
		type: String,
		required: true	
	},
	releaseDate: {
		type: Date,
		required: true	
	},
	tmdbID: {
		type: String,
		required: true
	},
	// moviePeople: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'MoviePerson'
	// }],
	genres: [{
		type: Schema.Types.ObjectId,
		ref: 'Genre'
	}]
});
// Create the model from the schema and export it
export default mongoose.model('Movie', movieSchema)