import express from "express";
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import { authenticate, authorize } from "./auth.js";

const router = express.Router();

// Get un utilisateur from un ID
router.get("/:id", function (req, res, next) {
	User.findOne({ '_id': req.params.id })
		// .populate('groups')
		.exec(function (err, users) {
			if (err) {
				return next(err);
			}
			res.send(users);
		});
});

// Get tous les utilisateurs
router.get("/", function (req, res, next) {
	User.find()
		// .populate('groups')
		.exec(function (err, users) {
			if (err) {
				return next(err);
			}
			res.send(users);
		});
});

// Créer un utilisateur
router.post("/", function (req, res, next) {
	const plainPassword = req.body.password;
	const costFactor = 10;

	bcrypt.hash(plainPassword, costFactor, function (err, hashedPassword) {
		if (err) {
			return next(err);
		}

		const newUser = new User(req.body);
		newUser.password = hashedPassword;
		newUser.registrationDate = Date.now();
		newUser.save(function (err, savedUser) {
			if (err) {
				return next(err);
			}
			res.send(savedUser);
		});
	});
});


// Supprime un utilisateur
router.delete("/:userID", authenticate, authorize('admin'), function (req, res, next) {
	User.deleteOne({ _id: req.params.userID }, function (err, user) {
		if (err) {
			return next(err);
		}
		res.send('User deleted')
	})
});

// Get tous les groupes d'un utilisateur
router.get('/:userID/groups', function (req, res, next) {
	User.findOne({ '_id': req.params.userID })
		.populate('groups')
		.exec(function (err, user) {
			if (err) {
				return next(err);
			}
			res.send(user.groups);
		});
})

// Ajouter un utilisateur à un groupe
router.post('/:userID/groups/:groupID', authorize('admin'), function (req, res, next) {
	User.findOne({ _id: req.params.userID }, function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user.groups.includes(req.params.groupID)) {
			user.groups.push(req.params.groupID)

			user.save(function (err) {
				if (err) {
					return next(err);
				}
			});
		}
		res.send(user)
	});
})

// Rejoindre un groupe
router.post('/groups/:groupID', authenticate, function (req, res, next) {
	let currentUserId = req.currentUserId
	User.findOne({ _id: currentUserId }, function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user.groups.includes(req.params.groupID)) {
			user.groups.push(req.params.groupID)

			user.save(function (err) {
				if (err) {
					return next(err);
				}
			});
		}
		res.send(user)
	});
})


// Enlever un utilisateur d'un groupe
router.delete('/:userID/groups/:groupID', authenticate, authorize('admin'), function (req, res, next) {
	User.findOne({ _id: req.params.userID }, function (err, user) {
		if (err) {
			return next(err);
		}
		if (user.groups.includes(req.params.groupID)) {
			user.groups.splice(user.groups.indexOf(req.params.groupID), 1)

			user.save(function (err) {
				if (err) {
					return next(err);
				}
			});
		}
		res.send(user)
	});
})

// Quitter un groupe
router.delete('/groups/:groupID', authenticate, function (req, res, next) {
	let currentUserId = req.currentUserId
	User.findOne({ _id: currentUserId }, function (err, user) {
		if (err) {
			return next(err);
		}
		if (user.groups.includes(req.params.groupID)) {
			user.groups.splice(user.groups.indexOf(req.params.groupID), 1)

			user.save(function (err) {
				if (err) {
					return next(err);
				}
			});
		}
		res.send(user)
	});
})

export default router;
