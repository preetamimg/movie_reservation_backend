const express = require("express");
const { validateField } = require("../middlewares/ValidationMiddleware");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const { genereSchema } = require("../validations/genereValidations");
const { addGenere, getGenere, deleteGenere, updateGenere } = require("../controllers/genereControllers");

const router = express.Router();


router.post("/addGenere", authMiddleware, validateField(genereSchema), addGenere);
router.get('/getGenere', getGenere)
router.get("/deleteGenere", authMiddleware, deleteGenere);
router.post("/updateGenere", authMiddleware, validateField(genereSchema), updateGenere);



module.exports = router;
