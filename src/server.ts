import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
app.use(express.json());

const port = 3000;

const prisma = new PrismaClient();

app.get("/", async (req: Request, res: Response) => {
  const allClassrooms = await prisma.classrooms.findMany();

  res.json(allClassrooms);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
