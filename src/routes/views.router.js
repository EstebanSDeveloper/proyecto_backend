import { json, Router } from "express";
import { manager, cartManager } from "../app.js";

const viewsRouter = Router();
viewsRouter.use(json());

viewsRouter.get("/", async (req, res) => {
	const { page, limit, sort, title, stock } = req.query;
	const query = { title, stock };
	const products = await manager.getProducts(page, limit, sort, query);
	res.render("index", { products, title: "Products" });
});

viewsRouter.get("/real-time-products", async (req, res) => {
	const { page, limit, sort, title, stock } = req.query;
	const query = { title, stock };
	const products = await manager.getProducts(page, limit, sort, query);
	res.render("real-time-products", { products, title: "Product real time" });
});

viewsRouter.get("/product/:pid", async (req, res) => {
	const { pid } = req.params;
	const product = await manager.getProductById(pid);
	res.render("product", product);
});

viewsRouter.get("/carts/:cid", async (req, res) => {
	const { cid } = req.params;
	const cart = await cartManager.getCartProducts(cid);
	const cartProducts = cart.products;
	console.log(cartProducts);
	res.render("cart", { cartProducts });
});

export default viewsRouter;
