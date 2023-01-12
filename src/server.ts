import express, { Express, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app: Express = express();
app.use(express.json());

const port = 3000;

const prisma = new PrismaClient();

app.get("/", async (req: Request, res: Response) => {
  await prisma.$connect();
  const allClassrooms = await prisma.classroom.findMany();

  res.json(allClassrooms);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
