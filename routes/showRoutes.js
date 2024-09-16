const express = require("express");
const { validateField } = require("../middlewares/ValidationMiddleware");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { createShow } = require("../controllers/showController");

const router = express.Router();


router.post("/createShow", authMiddleware, createShow);



module.exports = router;
