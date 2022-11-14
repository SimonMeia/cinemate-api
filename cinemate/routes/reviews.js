import express from "express";
import Review from '../models/review.js'
import User from "../models/user.js";
import Movie from "../models/movie.js";
import Genre from "../models/genre.js";
import MoviePerson from "../models/moviePerson.js";
import { TMDB_API_KEY } from "../config.js";
import { authenticate } from "./auth.js";

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

// Get les reviews des groupes d'un user
router.get("/mygroups", authenticate, function (req, res, next) {

	User.findOne({ 'id_': req.currentUserId }).exec(function (err, currentUser) {
		if (err) {
			return next(err)
		}

		User.find({ groups: { '$in': currentUser.groups }, _id: { '$ne': currentUser._id } }).exec(function (err, friends) {
			if (err) {
				return next(err)
			}
			friends = friends.map(f => f._id)

			Review.find({ user: { '$in': friends } })
				.populate('user')
				.populate('movie')
				.exec(function (err, reviews) {
					if (err) {
						return next(err)
					}
					res.send(reviews)
				})
		})

	})
});

// Créé une review
router.post("/", authenticate, findMovieID, async function (req, res, next) {
	req.body.user = req.currentUserId
	const newReview = new Review(req.body);

	newReview.save(function (err, savedReview) {
		if (err) {
			return next(err);
		}
		res.send(savedReview);
	});
});

// Supprime une review
router.delete("/:reviewID", authenticate, function (req, res, next) {

	Review.deleteOne({ _id: req.params.reviewID, user: req.currentUserId }, function (err, review) {
		if (err) {
			return next(err);
		}
		res.send('number of review deleted : ' + review.deletedCount)
	})
});

function findMovieID(req, res, next) {
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


async function createMovie(tmdbID) {
	const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB_API_KEY}`);
	const movie = await response.json();
	const responseCredits = await fetch(`https://api.themoviedb.org/3/movie/${tmdbID}/credits?api_key=${TMDB_API_KEY}`);
	const credits = await responseCredits.json();

	return await getMovieDetails(movie, credits).then(details => {
		let movieData = {
			title: movie.original_title,
			releaseDate: movie.release_date,
			posterURL: movie.poster_path,
			tmdbID: tmdbID,
			genres: details.genresID,
			moviePeople: details.moviePeople
		}

		const newMovie = new Movie(movieData);

		newMovie.save(function (err, savedMovie) {
			if (err) {
				return next(err);
			}
		});

		return newMovie
	})
}

async function getMovieDetails(movie, credits) {
	let movieDetails = {}
	movieDetails.genresID = await getMovieGenreIDs(movie.genres)
	movieDetails.moviePeople = await getMoviePeopleIDs(credits)
	return movieDetails
}

async function getMoviePeopleIDs(credits) {
	const peopleDB = await MoviePerson.find({})
	const namePeopleDB = peopleDB.map(p => p.name)

	let people = credits.cast.map(p => p.name).slice(0, 4)
	people.push(credits.crew.find(p => p.job == 'Director').name);
	let moviePeopleIDs = []

	for (const person of people) {
		if (!namePeopleDB.includes(person)) {

			const newPerson = new MoviePerson({ name: person })
			moviePeopleIDs.push(newPerson._id)
			newPerson.save(function (err, savedPerson) {
				if (err) {
					return next(err)
				}
			})
		} else {
			let personDB = peopleDB.find(p => p.name == person);
			moviePeopleIDs.push(personDB._id)
		}
	}
	return moviePeopleIDs;
}

async function getMovieGenreIDs(movieGenres) {
	const genresDB = await Genre.find({})
	const genresIDarray = [];
	const nameGenreDB = genresDB.map(genre => genre.name)

	for (const genre of movieGenres) {
		if (!nameGenreDB.includes(genre.name)) {

			const newGenre = new Genre({ name: genre.name })
			genresIDarray.push(newGenre._id)

			newGenre.save(function (err, savedGenre) {
				if (err) {
					return next(err)
				}
			})
		} else {
			let genreDB = genresDB.find(g => g.name == genre.name);
			genresIDarray.push(genreDB._id)
		}
	}

	return genresIDarray

}
export default router;
