import { json, Router } from "express";
import { manager, cartManager } from "../app.js";

const viewsRouter = Router();
viewsRouter.use(json());

viewsRouter.get("/", async (req, res) => {
	const { page, limit, sort, title, stock } = req.query;
	const query = { title, stock };
	const products = await manager.getProducts(page, limit, sort, query);
	const userData = req.session;
	console.log(req.session);
	res.render("index", { userData, products, title: "Productos" });
});

viewsRouter.get("/real-time-products", authenticate, async (req, res) => {
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

//middle se aut
async function authenticate(req, res, next) {
	//console.log(`esto se ve desde middleware ${req.user.role}`);
	if (req.user.role === "admin") {
		return next();
	} else {
		res.send(
			`${req.session.username} no tienes acceso, esta es un area solo para admin`
		);
	}
}

export default viewsRouter;
