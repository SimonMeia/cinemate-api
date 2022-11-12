import express from "express";
import Group from '../models/group.js'
import User from '../models/user.js'

const router = express.Router();

// Get les users d'un groupe
router.get("/:groupID/users", function (req, res, next) {
  User.find({'groups':req.params.groupID}).exec(function(err, users){
    if (err) {
      return next(err);
    }
    res.send(users);
  })
});

// Get tous les groupes
router.get("/", function (req, res, next) {
  Group.find().exec(function (err, groups) {
    if (err) {
      return next(err);
    }
    res.send(groups);
  });
});

// Créé un groupe
router.post("/", function (req, res, next) {
  const newGroup = new Group(req.body);
  console.log(req.body);

  newGroup.save(function (err, savedGroup) {
    if (err) {
      return next(err);
    }
    res.send(savedGroup);
  });
});

export default router;
