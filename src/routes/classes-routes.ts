import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";

export const classesRoute = Router();

const prisma = new PrismaClient();

classesRoute.get("", async (req: Request, res: Response) => {
  const classes = await prisma.events.findMany({
    distinct: ["class_code", "subject_code"],
  });

  res.json(classes);
});
