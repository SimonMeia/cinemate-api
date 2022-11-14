import express from "express";
import Review from '../models/review.js'
import User from "../models/user.js";
import Movie from "../models/movie.js";
import Genre from "../models/genre.js";
import { TMDB_API_KEY } from "../config.js";

const router = express.Router();

// Get les reviews d'un user
router.get("/users/:userID", function (req, res, next) {
	User.find({ 'groups': req.params.groupID }).exec(function (err, users) {
		if (err) {
			return next(err);
		}
		res.send(users);
	})
});

// Get toutes les reviews
router.get("/", function (req, res, next) {
	Review.find()
		.populate('user')
		.populate('movie')
		.exec(function (err, reviews) {
			if (err) {
				return next(err);
			}
			res.send(reviews);
		});
});

// Créé une review
router.post("/", findMovieID, async function (req, res, next) {

	const newReview = new Review(req.body);

	newReview.save(function (err, savedReview) {
		if (err) {
			return next(err);
		}
		res.send(savedReview);
	});

});

function findMovieID(req, res, next){
	// Check si le film existe dans la base
	Movie.findOne({ 'tmdbID': req.body.tmdbID }).exec(async function (err, movie) {
		if (err) {
			return next(err);
		}

		if (!movie) {
			await createMovie(req.body.tmdbID).then(m => {
				req.body.movie = m._id
				next()
			})
		} else {
			req.body.movie = movie._id
			next()
		}
	})
}

// Supprime un utilisateur
router.delete("/:reviewID", function (req, res, next) {
	// Check si l'id est valable ? -> Fonctionne sans le check
	Review.deleteOne({ _id: req.params.reviewID }, function (err, user) {
		if (err) {
			return next(err);
		}
		res.send('review deleted')
	})
});

async function createMovie(tmdbID) {
	const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB_API_KEY}`);
	const movie = await response.json();
	const genresID = await getMovieGenreIDs(movie.genres)
	console.log(genresID);

	let movieData = {
		title: movie.original_title,
		releaseDate: movie.release_date,
		posterURL: movie.poster_path,
		tmdbID: tmdbID,
		genres: genresID
	}

	const newMovie = new Movie(movieData);

	newMovie.save(function (err, savedMovie) {
		if (err) {
			return next(err);
		}
	});

	return newMovie
}


async function getMovieGenreIDs(movieGenres) {
	return Genre.find().exec(async function (err, genresDB) {
		if (err) {
			return next(err);
		}
		let genresID = []
		const nameGenreDB = genresDB.map(genre => genre.name)

		for (const genre of movieGenres) {
			if (!nameGenreDB.includes(genre.name)) {

				const newGenre = new Genre({ name: genre.name })

				newGenre.save(function (err, savedGenre) {
					if (err) {
						return next(err)
					}
					genresID.push(savedGenre._id)
				})
			} else {
				let genreDB = genresDB.find(g => g.name == genre.name);
				genresID.push(genreDB._id)
			}
		}
		console.log(genresID);
		return genresID
	})
}
export default router;
