import cartModel from "../models/cart.model.js";

export default class CartManager {
	constructor() {
		console.log("Working with DB system CART");
	}
	async getCarts() {
		try {
			const carts = await cartModel.find().lean();
			return carts;
		} catch (error) {
			console.log(error.message);
			return [];
		}
	}

	async addCart() {
		try {
			const cart = {
				products: [],
			};

			const result = await cartModel.create(cart);
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	async getCartProducts(id) {
		try {
			const cart = await cartModel.findById(id);
			return cart;
		} catch (error) {}
	}

	async addProductToCart(prod, cartID) {
		try {
			const cart = await cartModel.findById(cartID);
			const product = cart.products.find((elem) => elem.title === prod.title);
			if (product) {
				product.quantity += 1;
				await cart.save();
			} else {
				cart.products.push({ product: prod._id, title: prod.title });
				await cart.save();
			}

			console.log(cart);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteProductInCart(cartID, productID) {
		try {
			const cart = await cartModel.findById(cartID);
			const product = cart.products.find((elem) => elem.product === productID);

			if (!product) {
				throw new Error("There is no product with that ID");
			}
			if (product.quantity > 1) {
				product.quantity -= 1;
				cart.save();
			} else {
				let newCartProducts = cart.products.filter(
					(p) => p.product !== productID
				);
				cart.products = newCartProducts;
				cart.save();
			}
			console.log(cart);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
