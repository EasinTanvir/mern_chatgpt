const express = require("express");
const router = express.Router();
const gptRoutes = require("../controllers/user");
const protectRoutes = require("../helper/protectRoutes");

router.route("/gpt").post(protectRoutes, gptRoutes.createGpt);
router.route("/message").post(gptRoutes.createMessage);
router.route("/gpts").post(gptRoutes.getMessage);

module.exports = router;
