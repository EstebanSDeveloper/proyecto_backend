import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	thumbail: {
		type: Array,
		default: [],
	},
	code: {
		type: String,
		required: true,
		unique: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		default: true,
	},
	category: {
		type: String,
		required: true,
	},
});

const productModel = mongoose.model("products", productSchema);
export default productModel;

//1:35 solucionar error de category
