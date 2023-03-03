import { Router, json } from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = Router();
productsRouter.use(json());

const manager = new ProductManager("../products.json");

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
		// esto es lo que solicita que contenga el body para agregar un nuevo producto, thumbnail y status tienen caracteristicas predefinidas desde el req
		const newProduct = ({
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbail = [],
		} = req.body);
		await manager.addProduct(
			title,
			description,
			parseInt(code),
			parseInt(price),
			status,
			parseInt(stock),
			category,
			thumbail
		);

		products = [...products, newProduct];

		res.send({ status: "success", payload: req.body });
	} catch (error) {
		request.status(404).send({ status: "error" });
	}
});

productsRouter.put("/pid", async (req, res) => {
	try {
		const { pid } = req.params;
		await manager.updateProduct({ pid }, req.body);

		res.send({ status: "success", payload: await manager.getProductById(pid) });
	} catch (error) {}
});

export default productsRouter;
