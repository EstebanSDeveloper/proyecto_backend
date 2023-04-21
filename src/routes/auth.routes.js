import { Router } from "express";
import { UserModel } from "../dao/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

// AUTENTICACION PASSPORT GITHUB

router.get("/github", passport.authenticate("githubSignup"));

router.get(
	"/github-callback",
	passport.authenticate("githubSignup", {
		failureRedirect: "/api/sessions/failure-signup",
	}),
	(req, res) => {
		res.send("usuario autenticado");
	}
);

// AUTENTICACION CON PASSPORT

router.post(
	"/signup",
	passport.authenticate("signupStrategy", {
		failureRedirect: "api/sessions/failure-signup",
	}),
	(req, res) => {
		res.redirect("/");
	}
);

router.get("/failure-signup", async (req, res) => {
	res.send("No fue posible registrar el usuario");
});

//login passport

router.post(
	"/login",
	passport.authenticate("loginStrategy", {
		failureRedirect: "/api/sessions/login-failed",
	}),
	(req, res) => {
		res.redirect("/");
	}
);

router.get("/login-failed", (req, res) => {
	res.send({ error: "Failed login" });
});

router.get("/logout", (req, res) => {
	req.logOut((error) => {
		if (error) return res.send("no se pudo cerrar la sesion");
		req.session.destroy((err) => {
			if (err) return res.send("no se pudo cerrar la sesion");
			res.redirect("/login");
		});
	});
});

// AUTENTICACION CON SESSIONS

// registro

// router.post("/signup", async (req, res) => {
// 	try {
// 		const { email, password } = req.body;
// 		const user = await UserModel.findOne({ email: email });
// 		if (!user) {
// 			// si no existe el usuario lo registramos
// 			const newUser = {
// 				email,
// 				password: createHash(password),
// 			};
// 			const userCreated = await UserModel.create(newUser);
// 			req.session.user = newUser.email;
// 			// res.send("Usuario logueado")
// 			return res.redirect("/");
// 		}
// 		// si ya existe se envia un mensaje de que ya existe
// 		res.send(`Usuario ya registrado <a href="/login">Inicia sesion</a>`);
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

//login

// router.post("/login", async (req, res) => {
// 	const { email, password } = req.body;
// 	const authorized = await UserModel.findOne({ email: email }).lean();
// 	if (!authorized) {
// 		res.send("ususario no identificado");
// 	} else {
// 		if (email === "adminCoder@coder.com") {
// 			if (isValidPassword(authorized, password)) {
// 				req.session.user = authorized._id;
// 				req.session.username = email;
// 				req.session.rol = "admin";
// 				//console.log(req.session);
// 				return res.redirect("/");
// 			} else {
// 				res.redirect("/login");
// 			}
// 		} else {
// 			if (isValidPassword(authorized, password)) {
// 				req.session.user = authorized._id;
// 				req.session.username = email;
// 				req.session.rol = "user";
// 				return res.redirect("/");
// 			} else {
// 				res.redirect("/login");
// 			}
// 		}
// 		return res.redirect("/products");
// 	}
// });

export { router as AuthRouter };
