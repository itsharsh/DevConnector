const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

//@route    GET /api/profile/me
//@desc     Current User Profile
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({
        success: false,
        error: [
          {
            value: req.user.email,
            msg: "No Profile found",
          },
        ],
      });
    }
    res.json({ success: true, profile });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res
      .status(500)
      .json({ success: false, error: [{ msg: "Internal Server Error" }] });
  }
});

//@route    DELETE /api/profile
//@desc     Delete profile & user
//@access   Private
router.delete("/", auth, async (req, res) => {
  try {
    const isProfileDeleted = await Profile.findOneAndRemove({
      user: req.user.id,
    });
    const isUserDeleted = await User.findOneAndRemove({ _id: req.user.id });
    if (!isProfileDeleted && !isUserDeleted) {
      return res.json({ success: false, error: [{ msg: "User not found" }] });
    }

    console.log(`[INFO] User Deleted: ${req.user.id}`);
    res.json({ success: true, msg: "User Deleted Successfully" });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res
      .status(500)
      .json({ success: false, error: [{ msg: "Internal Server Error" }] });
  }
});

//@route    POST /api/profile
//@desc     Create or update Profile
//@access   Private
router.post("/", [
  auth,
  [
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills can not be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      experience,
      education,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (experience) profileFields.experience = experience;
    if (education) profileFields.education = education;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    profileFields.social = {};
    if (youtube) profileFields.social = youtube;
    if (twitter) profileFields.social = twitter;
    if (facebook) profileFields.social = facebook;
    if (linkedin) profileFields.social = linkedin;
    if (instagram) profileFields.social = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json({ success: true, profile });
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json({ success: true, profile });
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
      res
        .status(500)
        .json({ success: false, error: [{ msg: "Internal Server Error" }] });
    }
  },
]);

//@route    PUT /api/profile/experience
//@desc     Add Profile Experience
//@access   Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title cannot be empty").not().isEmpty(),
      check("company", "Company cannot be empty").not().isEmpty(),
      check("from", "From Date cannot be empty").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, error: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    let newExp = { title, company, location, from, to, current, description };
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json({ success: true, profile });
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
      res
        .status(500)
        .json({ success: false, error: [{ msg: "Internal Server Error" }] });
    }
  }
);

//@route    DELETE /api/profile/experience
//@desc     Delete Profile Experience
//@access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    let expIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(expIndex, 1);
    await profile.save();
    res.json({ success: true, profile });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res
      .status(500)
      .json({ success: false, error: [{ msg: "Internal Server Error" }] });
  }
});

//@route    PUT /api/profile/education
//@desc     Add education
//@access   Private
router.put(
  "/education",
  [
    auth,
    check("school", "School cannot be empty").not().isEmpty(),
    check("degree", "Degree cannot be empty").not().isEmpty(),
    check("from", "From date cannot be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, error: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json({ success: true, profile });
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
      res
        .status(500)
        .json({ success: false, error: [{ msg: "Internal Server Error" }] });
    }
  }
);

//@route    DELETE /api/profile/education/:edu_id
//@desc     Delete Education
//@access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    let eduIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(eduIndex, 1);
    profile.save();
    res.json({ success: true, profile });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res
      .status(500)
      .json({ success: false, error: [{ msg: "Internal Server Error" }] });
  }
});

//@route    GET /api/profile
//@desc     View all Profiles
//@access   Public
router.get("/", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json({ success: true, profiles });
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    res
      .status(500)
      .json({ success: false, error: [{ msg: "Internal Server Error" }] });
  }
});

//@route    GET /api/profile/user/user_id
//@desc     View user profile
//@access   Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ success: false, error: [{ msg: "Profile not found" }] });
    }
    res.json({ success: true, profile });
  } catch (err) {
    if (err.name == "CastError") {
      return res
        .status(400)
        .json({ success: false, error: [{ msg: "Profile not found" }] });
    }
    console.error(`[ERROR] ${err.message}`);
    res
      .status(500)
      .json({ success: false, error: [{ msg: "Internal Server Error" }] });
  }
});

module.exports = router;
