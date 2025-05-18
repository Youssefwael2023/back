const express = require("express");
const {
  getallproducts,
  addProduct,
  sellProduct,
} = require("../controllers/productservices");
const { productmodel } = require("../models/Products");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const products = await getallproducts();
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Error fetching products" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Image is required" });
  }
  const { name, price, stock, description, category, discount } = req.body;
  const image = req.file.path;

  try {
    const newProduct = await addProduct({
      name,
      image,
      price,
      stock,
      description,
      category,
      discount,
    });
    res
      .status(201)
      .send({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ message: "Error adding product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await productmodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productmodel.findByIdAndDelete(productId); // Fixed model reference
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productmodel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

router.put("/sell/:id", sellProduct);

module.exports = router;
