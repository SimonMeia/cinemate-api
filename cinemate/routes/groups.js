import express from "express";
import Group from '../models/group.js'
import User from '../models/user.js'
import { authenticate } from "./auth.js";
import bcrypt from 'bcrypt'
import { idValidation } from "../utils.js";

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
	const plainPassword = req.body.password;
	const costFactor = 10;

	bcrypt.hash(plainPassword, costFactor, function (err, hashedPassword) {
		if (err) {
			return next(err);
		}

		const newGroup = new Group(req.body);
		newGroup.password = hashedPassword;
		newGroup.save(function (err, savedGroup) {
			if (err) {
				return next(err);
			}

			let currentUserId = req.currentUserId
			User.findOne({ _id: currentUserId }, function (err, user) {
				if (err) {
					return next(err);
				}

				user.groups.push(savedGroup._id)
				user.save(function (err) {
					if (err) {
						return next(err);
					}
				});
				res.send(savedGroup);
			});
		});
	});
})

// Get les users d'un groupe
router.get("/:groupID/users", idValidation, authenticate, function (req, res, next) {
	User.find({ 'groups': req.params.groupID }).exec(function (err, users) {
		if (err) {
			return next(err);
		}
		res.send(users);
	})
});

export default router;
