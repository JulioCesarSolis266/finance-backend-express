import pkg from "jsonwebtoken";
const jwt = pkg;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Aqui optenemos Bearer <token>

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token> lo convierte en arreglo con 2 indices, accediento solo al segundo indice. AL toquen.

  if (!token) {
    //!token seria si el token es falso
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Aqui decodificamos el token

    req.user = decoded; // Esta informacion se usará en el controlador para identificar al usuario autenticado y acceder a sus recursos.
    next(); // Se pasa al siguiente middleware o controlador
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
