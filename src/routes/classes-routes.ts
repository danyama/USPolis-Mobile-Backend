import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";

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

  const result = await prisma.events.aggregateRaw({
    pipeline: aggregation,
  });

  res.json(result);
});
