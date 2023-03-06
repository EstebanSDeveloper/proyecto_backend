import { Router, json } from "express";
import { cartManager, manager } from "../app.js";

const cartsRouter = Router();
cartsRouter.use(json());

cartsRouter.post("/", async (req, res) => {
	try {
		await cartManager.addCart();
		res.send({ status: "success", payload: `Carrito creado:` });
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.get("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		let cart = await cartManager.getCartProducts(parseInt(cid));
		res.send({ status: "succes", payload: cart });
	} catch (error) {
		res.status(404).send({ status: "error", error: `${err}` });
	}
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const prodID = parseInt(pid);
		const cartID = parseInt(cid);
		let product = await manager.getProductById(prodID);
		await cartManager.addProductToCart(product, cartID);
		res.send({
			status: "success",
			payload: await cartManager.getCartProducts(cartID),
		});
	} catch (error) {
		res.status(404).send({ status: "error", error: `${err}` });
	}
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const prodID = parseInt(pid);
		const cartID = parseInt(cid);
		await cartManager.deleteProductInCart(cartID, prodID);
		res.send({
			status: "success",
			payload: `Producto Eliminado del carro #${cartID}`,
		});
	} catch (err) {
		res.status(404).send({status: 'error', error: `${err}`})
	}
});

export default cartsRouter;
