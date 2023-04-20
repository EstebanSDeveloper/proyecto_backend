import passport from "passport";
import LocalStrategy from "passport-local";
import { UserModel } from "../dao/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";

// funcion que me permite iniciar passport y poner logica de autenticacion para autenticacion

const inicializedPassport = () => {
	passport.use(
		"signupStrategy",
		new LocalStrategy(
			{
				usernameField: "email",
				passReqToCallback: true,
			},
			async (req, username, password, done) => {
				try {
					const { name, age } = req.body;
					const user = await UserModel.findOne({ email: username });
					if (user) {
						// cuando existe el usuario no hay accion y no se crea nada
						return done(null, false);
					} // si no existe en la base de datos, creamos un nuevo usuario

					const newUser = {
						name,
						age,
						email: username,
						password: createHash(password),
					};
					// dar rol de admin
					if (newUser.email === "adminCoder@coder.com") {
						newUser.role = "admin";
						const userAdminCreated = await UserModel.create(newUser);
						return done(null, userAdminCreated);
					}
					// dar rol de admin
					const userCreated = await UserModel.create(newUser);
					return done(null, userCreated);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.use(
		"loginStrategy",
		new LocalStrategy(
			{
				usernameField: "email",
			},
			async (username, password, done) => {
				try {
					const user = await UserModel.findOne({ email: username });
					// dar rol de admin
					const adminUser = await UserModel.findOne({
						email: "adminCoder@coder.com",
					});
					adminUser.role = "admin";
					await adminUser.save();
					// dar rol de admin
					if (!user) {
						console.log(`User with email ${username} not found`);
						return done(null, false);
					}
					if (!isValidPassword(user, password)) return done(null, false);
					return done(null, user);
				} catch (error) {
					return error;
				}
			}
		)
	);

	// serializar y deserializar usuarios
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await UserModel.findById(id);
		return done(null, user);
		//req.user = user
	});
};

export { inicializedPassport };
