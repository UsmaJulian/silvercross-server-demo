const { Router } = require("express");
const { append } = require("express/lib/response");
const { googleAuth } = require("../controllers/auth");

const router = Router();

router.post(
  "/google", //google controller
  googleAuth
);

module.exports = router;
