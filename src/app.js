import express, { json } from "express";
import { ProductManager, CartManager } from "./dao/index.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";
import { AuthRouter } from "./routes/auth.routes.js";
import { WebRouter } from "./routes/web.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { inicializedPassport } from "./config/passport.config.js";

const manager = new ProductManager();
const cartManager = new CartManager();
// const manager = new ProductManager("./src/jsons/products.json");
// const cartManager = new CartManager("./src/jsons/cart.json")
const app = express();
app.use(json());
app.use(express.urlencoded({ extended: true }));

//__dirname es para que haga el uso del archivo estatico, desde el directorio que tenga el mismo nombre que yo le voy a dar, el lo va a buscar
app.use(express.static(__dirname + "/../public"));

// Conexion mongoose para Mongo Atlas
// mongoose
// 	.connect(
// 		"mongodb+srv://estebansarmientop:hs11duZxEIqSBTFO@codercluster.rweugnj.mongodb.net/ecommerce?retryWrites=true&w=majority"
// 	)
// 	.then((conn) => {
// 		console.log("Connected to DB!");
// 	});

const database =
	"mongodb+srv://estebansarmientop:hs11duZxEIqSBTFO@codercluster.rweugnj.mongodb.net/ecommerce?retryWrites=true&w=majority";
mongoose.connect(database).then((conn) => {
	console.log("Connected to DB!");
});

// configuracion de la session

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: database,
		}),
		secret: "claveSecreta",
		saveUninitialized: true,
		resave: true,
	})
);

// configurar passport

inicializedPassport();
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Socket.IO
const httpServer = app.listen(8080, () => {
	console.log("Server listening on port 8080.");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
	console.log("New client connected.");
});

app.use((req, res, next) => {
	req.io = io;
	next();
});

// Router
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", AuthRouter);
app.use("/", WebRouter);

export { manager, cartManager };
