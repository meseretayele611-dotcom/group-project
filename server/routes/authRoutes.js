const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register (አዲስ ተጠቃሚ መመዝገቢያ)
router.post("/register", registerUser);

// POST /api/auth/login (ወደ ሲስተሙ መግቢያ)
router.post("/login", loginUser);

module.exports = router;
