import FileProductsManager from "./file-managers/productManager.js";
import FileCartManager from "./file-managers/cartManager.js";
import DbProductsManager from "./db-managers/productManager.js";
import DbCartManager from "./db-managers/cartManager.js";

const config = {
	persistanceType: "db",
};

let ProductManager, CartManager;

if (config.persistanceType === "db") {
	ProductManager = DbProductsManager;
	CartManager = DbCartManager;
} else if (config.persistanceType === "file") {
	ProductManager = FileProductsManager;
	CartManager = FileCartManager;
} else {
	throw new Error("Unknown presistence type");
}
export { ProductManager, CartManager };
