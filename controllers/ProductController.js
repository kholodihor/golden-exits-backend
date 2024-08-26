import ProductModel from '../models/ProductModel.js';

export const createProduct = async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Fail to create product',
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};
