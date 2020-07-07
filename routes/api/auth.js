const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@route    GET /api/auth
//@desc     Auth Test Route
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route    POST /api/auth/login
//@desc     Login User
//@access   Public
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        console.log(`[INFO] Invalid User: ${email}`);
        return res.status(401).json({
          success: false,
          error: [
            {
              value: email,
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      const chkPassword = await bcrypt.compare(password, user.password);
      if (!chkPassword) {
        console.log(`[INFO] Invalid Password: ${email}`);
        return res.status(401).json({
          success: false,
          error: [
            {
              value: email,
              msg: "Invalid Credentials",
            },
          ],
        });
      }

      let payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 1 * 60 * 60 },
        (err, token) => {
          if (err) throw err;
          res.json({ success: true, token });
        }
      );

      console.log(`[INFO] User LoggedIn: ${email}`);
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
      res
        .status(500)
        .json({ success: false, error: [{ msg: "Internal Server Error" }] });
    }
  }
);

//@route    POST /api/auth/register
//@desc     User Register Route
//@access   Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Enter password with 8 or more characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        console.log(`[INFO] User already registered: ${email}`);
        return res.status(400).json({
          success: false,
          error: [
            {
              value: email,
              msg: "User already registered",
            },
          ],
        });
      }

      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      let payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 1 * 60 * 60 },
        (err, token) => {
          if (err) throw err;
          res.json({ success: true, token });
        }
      );

      console.log(`[INFO] New User Registered: ${email}`);
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
      res
        .status(500)
        .json({ success: false, error: [{ msg: "Internal Server Error" }] });
    }
  }
);

module.exports = router;
