const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const newCategory = await addCategory(name, image);
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const updatedCategory = await updateCategory(id, name, image);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCategory(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
