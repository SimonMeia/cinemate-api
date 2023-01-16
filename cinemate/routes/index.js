import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.redirect('/api-docs');
  next()
});

export default router;
