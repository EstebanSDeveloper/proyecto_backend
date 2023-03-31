import fs from "fs";

class ProductManager {
	#path = "";

	constructor(path) {
		this.#path = path;
	}

	async getProducts() {
		try {
			const products = await fs.promises.readFile(this.#path, "utf-8");
			return JSON.parse(products);
		} catch {
			return [];
		}
	}

	async getIDs() {
		let products = await this.getProducts();
		// Genero un array con todos los id's.
		let ids = products.map((prods) => prods.id);
		// Saco el id mayor y lo retorno.
		let mayorID = Math.max(...ids);
		if (mayorID === -Infinity) {
			return 0;
		} else {
			return mayorID;
		}
	}

	async addProduct(
		title,
		description,
		code,
		price,
		status,
		stock,
		category,
		thumbnail
	) {
		try {
			// Al último ID le sumo 1 y se lo asigno a la propiedad id del objeto.
			let mayorID = await this.getIDs();

			const product = {
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
				id: ++mayorID,
			};

			let products = await this.getProducts();
			let verificar = Object.values(product);
			let sameCode = products.find((prod) => prod.code === code);

			if (verificar.includes(undefined)) {
				throw new Error(
					`El producto ${product.title} NO ha sido cargado, debe completar todos los datos.`
				);
			}
			if (sameCode) {
				throw new Error(
					`El producto ${product.title} NO ha sido cargado ya que la propiedad "code" está repetida, ${sameCode.title} tiene el mismo valor.`
				);
			}

			products = [...products, product];
			console.log(`${product.title} cargado correctamente.`);
			await fs.promises.writeFile(this.#path, JSON.stringify(products));
		} catch (err) {
			throw new Error(err);
		}
	}

	//Para modificar un producto debemos pasar como primer parámetro el ID, y como segundo parámetro un objeto con las propiedades modificadas.
	async updateProduct(id, propModify) {
		let products = await this.getProducts();
		let productModify = products.find((i) => i.id === id);

		if (!productModify) {
			throw new Error("No se encontró ningún producto con ese ID.");
		}

		// Hago una verificación para que no se pueda cambiar la prop ID de ningún producto
		if (Object.keys(propModify).includes("id")) {
			throw new Error("No es posible modificar el ID de un producto.");
		}

		// Hago una verificación para que no se pueda cambiar la propiedad 'code' por una que ya exista.
		if (Object.keys(propModify).includes("code")) {
			let sameCode = products.some((i) => i.code === propModify.code);
			if (sameCode) {
				throw new Error(
					"No es posible modificar la propiedad code por una que ya exista."
				);
			}
		}

		// Modificamos el producto y filtramos un array sin el producto modificado para agreagarlo y que no se repita.
		productModify = { ...productModify, ...propModify };
		let newArray = products.filter((prods) => prods.id !== id);
		newArray = [...newArray, productModify];
		await fs.promises.writeFile(this.#path, JSON.stringify(newArray));
		console.log("Modificación realizada con éxito.");
	}

	async getProductById(id) {
		let products = await this.getProducts();
		let element = products.find((elem) => elem.id === id);
		if (element) {
			return element;
		} else {
			throw new Error("No se encuentra producto con ese ID.");
		}
	}

	async deleteProduct(id) {
		let products = await this.getProducts();
		let check = products.some((prod) => prod.id === id);

		if (!check) {
			throw new Error("No existe producto con ese ID.");
		}

		let newArray = products.filter((prods) => prods.id !== id);
		await fs.promises.writeFile(this.#path, JSON.stringify(newArray));
		console.log(`Producto con id ${id} eliminado con éxito`);
	}
}

async function main() {
	const manager = new ProductManager();

	//----------TEST ADD PRODUCT = SHIFT + ALT +F DAR FORMATO A .JSON

	// await manager.addProduct(
	// 	"Manzana",
	// 	"Es una manzana",
	// 	200,
	// 	5,
	// 	true,
	// 	10,
	// 	"fruts",
	// 	"../public/apple.webp"
	// );
	// await manager.addProduct(
	// 	"Durazno",
	// 	"Es un durazno",
	// 	201,
	// 	3,
	// 	true,
	// 	23,
	// 	"fruts",
	// 	"../public/peach.webp"
	// );
	// await manager.addProduct(
	// 	"Pera",
	// 	"Es una pera",
	// 	202,
	// 	4,
	// 	true,
	// 	15,
	// 	"fruts",
	// 	"../public/pear.webp"
	// );
	// await manager.addProduct(
	// 	"Banana",
	// 	"Son bananas",
	// 	203,
	// 	1,
	// 	true,
	// 	50,
	// 	"fruts",
	// 	"../public/banana.webp"
	// );
	// console.log(await manager.getProducts());

	//----------TEST GET PRODUCT BY ID
	// const searchedProduct = manager.getProductById(3);
	// console.log(await searchedProduct);
	//----------TEST DELETE PRODUCT
	// await manager.deleteProduct(3);
	// console.log(await manager.getProducts());
	//----------ACTUALIZAR PRODUCTOS
	// const productUpdates = {
	// 	title: "pinaASD2",
	// 	description: "hey apple hey NEWASDFWWWW",
	// 	price: 50,
	// 	thumbnail: "con foto",
	// 	code: "codigASDo4",
	// 	stock: 2,
	// };
	// const UpdateProductPera = manager.updateProduct(1, productUpdates);
	// console.log(await UpdateProductPera);
	// console.log(await manager.getProducts());
}

main();

export default ProductManager;
