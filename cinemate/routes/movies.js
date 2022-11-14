import express from "express";
import Movie from '../models/movie.js'

const router = express.Router();

// Get tous les films
router.get("/", function (req, res, next) {
    Movie.find()
        .populate('genres')
        .exec(function (err, movies) {
            if (err) {
                return next(err);
            }
            res.send(movies);
        });
});

export default router;
