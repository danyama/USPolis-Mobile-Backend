import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { Schedule, ListedEvent } from "../types";
import { getAbbreviatedClassCode, mapWeekDays } from "../utils";

export const classesRoute = Router();

const prisma = new PrismaClient();

classesRoute.get("", async (req: Request, res: Response) => {
  const aggregation = [
    {
      $group: {
        _id: {
          class_code: "$class_code",
          subject_code: "$subject_code",
          subject_name: "$subject_name",
          professor: "$professor",
          start_period: "$start_period",
          end_period: "$end_period",
        },
        schedule: {
          $push: {
            id: "$_id",
            week_day: "$week_day",
            start_time: "$start_time",
            end_time: "$end_time",
            building: "$building",
            classroom: "$classroom",
          },
        },
      },
    },
  ];

  const results = await prisma.events.aggregateRaw({
    pipeline: aggregation,
  });


  const formattedResults = Array.isArray(results) && results.map((result: ListedEvent) => ({
    ...result._id,
    id: `${result._id.subject_code}_${result._id.class_code}`,
    class_code: getAbbreviatedClassCode(result._id.class_code),
    schedule: result.schedule.map((day: Schedule) => {
      return {
        ...day,
        week_day: mapWeekDays(day.week_day)
      }
    })
  }))

  res.json(formattedResults);
});
