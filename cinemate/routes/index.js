import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.redirect('/api-docs');
});

export default router;
