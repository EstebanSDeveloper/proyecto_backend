import productModel from "../models/product.model.js";

export default class ProductManager {
	constructor() {
		console.log("Working with DB system PRODUCTS");
	}

	async getProducts() {
		try {
			const products = await productModel.find().lean();
			return products;
		} catch (err) {
			console.log(err.message);
			return [];
		}
	}

	async addProduct(
		title,
		description,
		price,
		thumbail,
		code,
		stock,
		status,
		category
	) {
		try {
			const product = {
				title,
				description,
				price,
				thumbail,
				code,
				stock,
				status,
				category,
			};
			const result = await productModel.create(product);
			return result;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getProductById(id) {
		try {
			const product = await productModel.findById(id);
			return product;
		} catch (err) {
			throw new Error(err);
		}
	}

	async deleteProduct(id) {
		try {
			const result = await productModel.deleteOne({ _id: id });
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	async updateProduct(id, propModify) {
		try {
			const result = await productModel.findOneAndUpdate(
				{ _id: id },
				propModify,
				{ new: true }
			);
			return result;
		} catch (err) {
			throw new Error(err);
		}
	}
}
