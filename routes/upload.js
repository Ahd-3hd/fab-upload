const express = require("express");
const upload = require("../controllers/upload");

router = express.Router();

router.post("/upload", upload.upload);

module.exports = router;
