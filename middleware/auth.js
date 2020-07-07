const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: [{ msg: "No Token" }] });
  }

  try {
    let decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(`[ERROR]${err.message}: ${token}`);
    res.status(500).json({ success: false, error: [{ msg: "Invalid Token" }] });
  }
};
