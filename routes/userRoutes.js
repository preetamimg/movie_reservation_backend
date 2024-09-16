const express = require("express");
const { RegisterUser, LoginUser, ChangeUserRole } = require("../controllers/userController");
const { validateField } = require("../middlewares/ValidationMiddleware");
const { userSchema } = require("../validations/userValidations");
const { authMiddleware } = require("../middlewares/AuthMiddleware");

const router = express.Router();


router.post("/register", validateField(userSchema), RegisterUser);
router.post("/login", validateField(userSchema), LoginUser);
router.get("/changeUserRole", authMiddleware, ChangeUserRole);


module.exports = router;
