const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getallusers,
  deleteUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getallusers);

router.get("/profile/:id", protect, getProfile);
router.put("/profile/:id", protect, updateProfile);

router.delete("/:id", protect, deleteUser);
module.exports = router;
