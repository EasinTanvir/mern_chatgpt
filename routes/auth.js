const express = require("express");
const router = express.Router();
const authRoutes = require("../controllers/auth");
//const protectRoutes = require("../helper/protectRoutes");

router.route("/signup").post(authRoutes.createUser);
router.route("/google").post(authRoutes.googleSignIn);
router.route("/login").post(authRoutes.signIn);

module.exports = router;
