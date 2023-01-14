import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { Event } from "../types";
import { getAbbreviatedClassCode } from "../utils";

export const classesRoute = Router();

const prisma = new PrismaClient();

classesRoute.get("", async (req: Request, res: Response) => {
  const allEvents = await prisma.events.findMany({
    distinct: ["class_code", "subject_code"],
  });

  const distinctClasses = allEvents.map((event: Event) => ({
    subjectCode: event.subject_code,
    subjectName: event.subject_name,
    classCode: getAbbreviatedClassCode(event.class_code),
    building: event.building,
  }));

  res.json(distinctClasses);
});
