import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { Event } from "../types";
import { getAbbreviatedClassCode, mapWeekDays } from "../utils";

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

classesRoute.get("/detail", async (req: Request, res: Response) => {
  const { subjectCode, classCode } = req.query;

  const fullClassCode = (
    classCode?.length === 1 ? `0${classCode}` : classCode
  ) as string;

  const classInfo = await prisma.events.findMany({
    where: {
      subject_code: {
        equals: subjectCode as string,
      },
      class_code: {
        endsWith: fullClassCode,
      },
    },
  });

  if (classInfo.length === 0) {
    res.status(404);
    res.json({ detail: "Turma não encontrada!" });
    return;
  }

  const classDetail = {
    subjectName: classInfo?.[0]?.subject_name,
    subjectCode: classInfo?.[0]?.subject_code,
    classCode: getAbbreviatedClassCode(classInfo?.[0]?.class_code),
    building: classInfo?.[0]?.building,
    professor: classInfo?.[0]?.professor,
    startPeriod: classInfo?.[0]?.start_period,
    endPeriod: classInfo?.[0]?.end_period,
    schedule: classInfo.map((event: Event) => ({
      weekDay: mapWeekDays(event?.week_day),
      startTime: event?.start_time,
      endTime: event?.end_time,
      classroom: event?.classroom,
    })),
  };

  res.json(classDetail);
});
