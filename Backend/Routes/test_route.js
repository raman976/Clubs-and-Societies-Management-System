const express = require("express");
const rootTestRoute = require("../Controllers/root_test_route.js");
const router = express.Router();

const { test } = rootTestRoute;

router.get("/", test);

module.exports = router;
