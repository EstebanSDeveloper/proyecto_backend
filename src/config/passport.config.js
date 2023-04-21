import passport from "passport";
import LocalStrategy from "passport-local";
import { UserModel } from "../dao/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

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

	// Estrategia autenticar usuarios a traves de github usando middleware
	passport.use(
		"githubSignup",
		new GitHubStrategy(
			{
				clientID: "Iv1.29c407f068be49d5",
				clientSecret: "f7c554780a2b1ec3787db432915104c439aea082",
				callbackURL: "http://localhost:8080/api/sessions/github-callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					console.log("profile", profile);
					const userExists = await UserModel.findOne({
						email: profile.username,
					});
					if (userExists) {
						return done(null, userExists);
					}
					const newUser = {
						name: profile.displayName,
						age: null,
						email: profile.username,
						password: createHash(profile.id),
						role: "user",
					};
					const userCreated = await UserModel.create(newUser);
					return done(null, userCreated);
				} catch (error) {
					return done(error);
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
