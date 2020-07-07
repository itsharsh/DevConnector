const express = require("express");
const router = express.Router();

//@route    GET /api/posts
//@desc     posts Test Route
//@access   Public
router.get("/", (req, res) => {
  res.send("posts Route");
});

module.exports = router;
