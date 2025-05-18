const mongoose = require("mongoose");
const { Schema } = mongoose;

const productschema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    discount: { type: Number, default: 0 },
    soldQuantity: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

  },
  {
    timestamps: true,
  }
);

const productmodel = mongoose.model("Product", productschema);

module.exports = { productmodel };
