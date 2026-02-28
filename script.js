import { prisma } from "./src/config/prisma.js";

const main = {
  update: async (id, userId, data) => {
    const category = await prisma.category.findFirst({ where: { id, userId } });
  },
};
console.log(main.update.category);
