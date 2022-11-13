import express from "express";
import MoviePerson from '../models/moviePerson.js'

const router = express.Router();

// Get tous les movie people
router.get("/", function (req, res, next) {
    MoviePerson.find()
        .exec(function (err, moviePeople) {
            if (err) {
                return next(err);
            }
            res.send(moviePeople);
        });
});

export default router;
