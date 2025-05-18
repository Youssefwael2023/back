const { productmodel } = require("../models/Products");

const getallproducts = async () => {
  try {
    return await productmodel.find();
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

const addProduct = async (productData) => {
  const { name, image, price, stock, description, category, discount } =
    productData;
  const newProduct = new productmodel({
    name,
    image,
    price,
    stock,
    description,
    category,
    discount,
  });

  await newProduct.save();
  return newProduct;
};

const sellProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await productmodel.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).send({ message: "Not enough stock" });
    }
    const priceAfterDiscount = product.price * (1 - product.discount / 100);

    product.soldQuantity += quantity;
    product.totalRevenue += priceAfterDiscount * quantity;
    product.stock -= quantity;

    await product.save();
    res.status(200).json({
      message: "Product sold successfully",
      product,
    });
  } catch (error) {
    console.error("Error selling product:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getallproducts,
  addProduct,
  sellProduct,
};
