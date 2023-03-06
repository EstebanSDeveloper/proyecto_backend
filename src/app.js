import express, { json } from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import CartManager from "./app/cartManager.js";
import ProductManager from "./app/productManager.js";
import __dirname from "./utils.js";

const manager = new ProductManager("./src/jsons/products.json");
const cartManager = new CartManager("./src/jsons/cart.json");

const app = express();
app.use(json());

//__dirname es para que haga el uso del archivo estatico, desde el directorio que tenga el mismo nombre que yo le voy a dar, el lo va a buscar
app.use(express.static(__dirname + "../public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => {
	console.log("Server listening on port 8080.");
});

export { manager, cartManager };
