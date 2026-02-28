import { prisma } from "../../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authService = {
  register: async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Email y contraseña son obligatorios");
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Credenciales inválidas");
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("Credenciales inválidas");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    return { token };
  },
};

export default authService;
