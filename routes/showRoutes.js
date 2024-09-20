const express = require("express");
const { validateField } = require("../middlewares/ValidationMiddleware");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { createShow, getShows } = require("../controllers/showController");

const router = express.Router();


router.post("/createShow", authMiddleware, createShow);
router.get('/getShows', authMiddleware, getShows)


module.exports = router;
