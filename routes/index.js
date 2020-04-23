const router = require("express").Router();
const controller = require("../controllers");

router.route("/").get(controller.handleRootRequest);

router.route("/job-description").post(controller.saveJobDescription);

module.exports = router;
