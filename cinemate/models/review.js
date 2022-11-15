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
	},
	location: {
		type: {
			type: String,
			// required: true,
			enum: ['Point'],
			default: "Point"
		},
		coordinates: {
			type: [Number],
			// required: true,
			validate: {
				validator: validateGeoJsonCoordinates,
				message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
			},
			default: [6.647778558579233, 46.78060279685718]
		}
	},
	medias: [{
		type: String
	}]
});

// Create a geospatial index on the location property.
reviewSchema.index({ location: '2dsphere' });

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
	return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
	return value >= -90 && value <= 90;
}

function isLongitude(value) {
	return value >= -180 && value <= 180;
}
// Create the model from the schema and export it
export default mongoose.model('Review', reviewSchema)