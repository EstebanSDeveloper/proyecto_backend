import { fileURLToPath } from "url";
import { dirname } from "path";

// Debemos crear nuestra propia variable __dirname a través de este método si usamos ES

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
