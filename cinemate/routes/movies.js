import express from "express";
import Movie from "../models/movie.js";
import User from "../models/user.js";
import Review from "../models/review.js";
import { idValidation } from "../utils.js";
import { authenticate } from "./auth.js";

const router = express.Router();

// Get tous les films
router.get("/", function (req, res, next) {
    Movie.find()
        .populate("genres")
        .populate("moviePeople")
        .exec(function (err, movies) {
            if (err) {
                return next(err);
            }
            res.send(movies);
        });
});
// Get un film spécifique
// router.get("/:id", idValidation, function (req, res, next) {
//     Movie.findOne({ _id: req.params.id })
//         .populate("genres")
//         .populate("moviePeople")
//         .exec(function (err, movies) {
//             if (err) {
//                 return next(err);
//             }
//             res.send(movies);
//         });
// });

// Get les movies des groupes d'un user
router.get("/mygroups", authenticate, function (req, res, next) {
    console.log('lol')
    User.findOne({ _id: req.currentUserId }).exec(function (err, currentUser) {
        if (err) {
            return next(err);
        }
        User.find({ groups: { $in: currentUser.groups } }).exec(function (err, friends) {
            if (err) {
                return next(err);
            }
            friends = friends.map((f) => f._id);
            Review.find({ user: { $in: friends } }).exec(function (err, reviews) {
                if (err) {
                    return next(err);
                }
                // res.send(reviews)
                reviews = reviews.map((r) => r.movie);
                Movie.find({ _id: { $in: reviews } })
                    .populate("moviePeople")
                    .populate("genres")
                    .exec(function (err, movies) {
                        if (err) {
                            return next(err);
                        }
                        res.send(movies);
                    });
            });
        });
    });
});

export default router;
