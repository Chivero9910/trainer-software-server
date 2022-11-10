const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const exercise = require("./exercise.routes")
router.use("/exercise", exercise)

const profile = require("./profile.routes")
router.use("/profile", profile)

module.exports = router;
