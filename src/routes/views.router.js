import { json, Router } from "express";
import { manager } from "../app.js";

const viewsRouter = Router();
viewsRouter.use(json());

viewsRouter.get("/", async (req, res) => {
	const products = await manager.getProducts();
	res.render("index", { products, title: "Products" });
});

viewsRouter.get("/real-time-products", async (req, res) => {
	const products = await manager.getProducts();
	res.render("real-time-products", { products, title: "Product real time" });
});

export default viewsRouter;
