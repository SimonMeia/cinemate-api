import express from "express";
import Movie from '../models/movie.js'

const router = express.Router();

// Get tous les films
router.get("/", function (req, res, next) {
    Movie.find()
        .populate('genres')
        .populate('moviePeople')
        .exec(function (err, movies) {
            if (err) {
                return next(err);
            }
            res.send(movies);
        });
});
// Get un film spécifique
router.get("/:id", idValidation, function (req, res, next) {
    Movie.findOne({ '_id': req.params.id })
        .populate('genres')
        .populate('moviePeople')
        .exec(function (err, movies) {
            if (err) {
                return next(err);
            }
            res.send(movies);
        });
});

export default router;
