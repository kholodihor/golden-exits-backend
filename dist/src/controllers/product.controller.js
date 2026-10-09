import { HTTPException } from "hono/http-exception";
import ProductModel from "../models/product.model.js";
import { createProductSchema } from "../schema/index.js";
export async function createProduct(c) {
    const product = createProductSchema.parse(await c.req.json());
    const newProduct = await ProductModel.create(product);
    return c.json(newProduct);
}
export async function getProduct(c) {
    const product = await ProductModel.findById(c.req.param("id"));
    if (!product) {
        throw new HTTPException(404, { message: "Product not found" });
    }
    return c.json(product);
}
export async function getAllProducts(c) {
    const products = await ProductModel.find();
    return c.json(products);
}
