let products = [];

import { v4 as uuidv4 } from "uuid";
import ProductModel from "../model/product.js";

const INSERT_PRODUCT = async (req, res) => {
  const { product_name, product_price, product_description, userId, status } = req.body;

  const titleExists = products.some((product) => product.product_name === product_name);

  if (titleExists) {
    return res.status(409).json({ response: "product_name already exists" });
  }

  const newProduct = {
    id: uuidv4(),
    product_name,
    product_price: parseFloat(product_price),
    product_description,
    userId,
  };

  console.log("userId", userId);
  
  const product = new ProductModel(newProduct);

  try {
    const response = await product.save();
    return res.status(201).json({ response: "product was inserted successfully", product: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "error while saving the product" });
  }
};


const SORT_PRODUCT = (req, res) => {
  try {
    const sortedProducts = [...products].sort((a, b) => a.rating - b.rating);
    return res.status(200).json({ products: sortedProducts });
  } catch {
    return res.status(500).json({ error: "error" });
  }
};

const GET_PRODUCT_BY_ID = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.params.id }); 

    if (!product) {
      return res
        .status(404)
        .json({ message: `no product with id ${req.params.id}` });
    }

    if (product.userId !== req.body.userId) {
      return res.status(403).json({ message: "this resource does not belong to you" });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: "we have some problems" });
  }
};

const GET_PRODUCTS = async (req, res) => {
  try {
    const products = await ProductModel.find({userId: req.body.userId});
    return res.status(200).json({ products: products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "we have some problems" });
  }
};

const DELETE_PRODUCT = async (req, res) => {
  try {
    const response = await ProductModel.findOneAndDelete({ id: req.params.id });

    if (!response) {
      return res.status(404).json({ message: `product with ID ${req.params.id} does not exist` });
    }

    return res.status(200).json({ message: "product was deleted", product: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "we have problems" });
  }
};


const UPDATE_PRODUCT = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }


    if (product.userId !== req.body.userId) {
      return res.status(403).json({ message: "this resource does not belong to you" });
    }

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body },
      { new: true }
    );

    return res.status(200).json({ message: "product was updated", product: updatedProduct });
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "we have some problems" });
  }
};

export {
  INSERT_PRODUCT,
  SORT_PRODUCT,
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
};






