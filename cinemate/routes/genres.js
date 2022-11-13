import express from "express";
import Genre from '../models/genre.js'

const router = express.Router();

// Get tous les genres
router.get("/", function (req, res, next) {
    Genre.find()
        .exec(function (err, genres) {
            if (err) {
                return next(err);
            }
            res.send(genres);
        });
});

export default router;
