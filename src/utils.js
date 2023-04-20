import { fileURLToPath } from "url";
import { dirname } from "path";
// 1 encriptacion de contrasena
import bcrypt from "bcrypt";

// Debemos crear nuestra propia variable __dirname a través de este método si usamos ES

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1 encriptacion de contrasena
export const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

// funcion para validad la contrasena
export const isValidPassword = (user, loginPassword) => {
	return bcrypt.compareSync(loginPassword, user.password);
};

export default __dirname;
