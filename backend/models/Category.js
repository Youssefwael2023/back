const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = { categoryModel };
