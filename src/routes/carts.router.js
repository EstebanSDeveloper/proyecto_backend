import { Router, json } from "express";
import { cartManager, manager } from "../app.js";

const cartsRouter = Router();
cartsRouter.use(json());

cartsRouter.post("/", async (req, res) => {
	try {
		await cartManager.addCart();
		res.send({ status: "success", payload: `Carrito creado.` });
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.get("/", async (req, res) => {
	try {
		const carts = await cartManager.getCarts();
		res.send({ status: "succes", payload: carts });
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.get("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		let cart = await cartManager.getCartProducts(cid);
		res.send({ status: "succes", payload: cart });
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		let product = await manager.getProductById(pid);
		await cartManager.addProductToCart(product, cid);
		res.send({
			status: "success",
			payload: await cartManager.getCartProducts(cid),
		});
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		await cartManager.deleteProductInCart(cid, pid);
		res.send({
			status: "success",
			payload: `Producto Eliminado del carro #${cid}`,
		});
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
	try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
		await cartManager.moreQuantity(cid, pid, quantity);

		res.send({
			status: "success",
			payload: `Quantity of product with id:${pid} updated`,
		});
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

cartsRouter.delete("/:cid", async (req, res) => {
	try {
		const { cid } = req.params;
		const result = await cartManager.clearCart(cid);
		res.send({ status: "success", payload: result });
	} catch (error) {
		res.status(404).send({ status: "error", error: `${error}` });
	}
});

export default cartsRouter;
