import { Router, json } from "express";
import { manager } from "../app.js";

const productsRouter = Router();
productsRouter.use(json());

productsRouter.get("/", async (req, res) => {
	try {
		const products = await manager.getProducts();
		const { limit } = req.query;

		if (limit > products.length) {
			res.send("No existen tantos articulos en la base de datos");
		}
		if (!limit) {
			res.send(products);
		} else {
			products.length = limit;
			res.send(products);
		}
	} catch (err) {
		res.status(404).send(`${err}`);
	}
});

productsRouter.get("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const product = await manager.getProductById(parseInt(pid));
		res.send(product);
	} catch (err) {
		res.status(404).send(`${err}`);
	}
});

productsRouter.post("/", async (req, res) => {
	try {
		// En el body no envío "thumbail" ni "status", los defino por defecto hasta que tenga que cambiarlo
		const {
			title,
			description,
			code,
			price,
			status = true,
			stock,
			category,
			thumbail = [],
		} = req.body;
		await manager.addProduct(
			title,
			description,
			code,
			parseInt(price),
			status,
			parseInt(stock),
			category,
			thumbail
		);
		//WEBSOCKET
		req.io.emit("new-product", req.body);
		res.send({ status: "succes", payload: req.body });
	} catch (err) {
		res.status(404).send({ status: "error", error: `${err}` });
	}
});

productsRouter.put("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const id = parseInt(pid);
		await manager.updateProduct(id, req.body);

		//WEBSOCKET
		const products = await manager.getProducts();
		req.io.emit("update-product", products);

		res.send({ status: "success", payload: await manager.getProductById(id) });
	} catch (err) {
		res.status(404).send({ status: "error", error: `${err}` });
	}
});

productsRouter.delete("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const id = parseInt(pid);
		await manager.deleteProduct(id);

		//WEBSOCKET
		const products = await manager.getProducts();
		req.io.emit("delete-product", products);

		res.send({
			status: "success",
			payload: `product with the ID: ${id} was deleted`,
		});
	} catch (err) {
		res.status(404).send({ status: "error", error: `${err}` });
	}
});

export default productsRouter;
