import express from "express";
import Group from "../models/group.js";
import User from "../models/user.js";
import { authenticate } from "./auth.js";
import bcrypt from "bcrypt";
import { idValidation } from "../utils.js";
import { Error } from "mongoose";

const router = express.Router();

// Get tous les groupes
router.get("/", authenticate, function (req, res, next) {
    Group.find().exec(function (err, groups) {
        if (err) {
            return next(err);
        }
        res.send(groups);
    });
});

// Créé un groupe
router.post("/", authenticate, function (req, res, next) {
    const newGroup = new Group(req.body);
    Group.findOne({ name: req.body.name }).exec(function (err, group) {
        if (err) {
            return next(err);
        }
        if (group) {
            let err = new Error("Ressource already exists");
            err.status = 406;
            return next(err);
        } else {
            newGroup.save(function (err, savedGroup) {
                let currentUserId = req.currentUserId;
                User.findOne({ _id: currentUserId }, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    user.groups.push(savedGroup._id);
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                    });
                    res.send(savedGroup);
                });
            });
        }
    });
});

// Edit un groupe
router.patch("/:id", (req, res, next) => {
    Group.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((group) => {
            if (!group) {
                return res.status(404).send();
            }
            res.send(group);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

// Get les users d'un groupe
router.get("/:groupID/users", idValidation, authenticate, function (req, res, next) {
    User.find({ groups: req.params.groupID }).exec(function (err, users) {
        if (err) {
            return next(err);
        }
        res.send(users);
    });
});

export default router;
