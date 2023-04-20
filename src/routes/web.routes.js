import { Router } from "express";

const router = Router();

// rutas de vistas

router.get("/", (req, res) => {
	res.render("index");
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/signup", (req, res) => {
	res.render("register");
});

router.get("/profile", (req, res) => {
	console.log(req.user);
	res.render("profile");
});

export { router as WebRouter };
