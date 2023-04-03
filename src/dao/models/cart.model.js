import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	products: {
		type: [
			{
				product: {
					type: String,
				},
				title: {
					type: String,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],

		default: [],
		// Luego utilizar populate
		// type: [
		//     {
		//         product: {
		//            type: mongoose.Schema.Types.ObjectId,
		//            ref: "products"
		//         }
		//     }
		// ],
	},
});

const cartModel = mongoose.model("carts", cartSchema);
export default cartModel;
