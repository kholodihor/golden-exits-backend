import ProductModel from "../models/product.model";
import { createProductSchema } from "../schema";
export const createProduct = async (c) => {
    const data = await c.req.json();
    const product = createProductSchema.parse(data);
    try {
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return c.json(newProduct);
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Failed to create product");
    }
};
export const getProduct = async (c) => {
    try {
        const productId = await c.req.param("id");
        const product = await ProductModel.findById(productId);
        return c.json(product);
    }
    catch (err) {
        console.log(err);
        c.status(404);
        throw new Error("Product not found");
    }
};
export const getAllProducts = async (c) => {
    try {
        const products = await ProductModel.find();
        return c.json(products);
    }
    catch (err) {
        console.log(err);
        c.status(404);
        throw new Error("Products not found");
    }
};
