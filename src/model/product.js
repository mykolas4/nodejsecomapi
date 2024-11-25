import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_description: { type: String, required: true },
  userId: {type: String, required: true},
});

export default mongoose.model("Product", ProductSchema);

