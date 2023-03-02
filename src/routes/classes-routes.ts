import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import { mapResults } from "../utils";
import * as redis from 'redis'

export const classesRoute = Router();
const prisma = new PrismaClient();

let redisClient: redis.RedisClientType;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error: any) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

const getClasses = async () => {
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

  const formattedResults = Array.isArray(results) && await mapResults(prisma, results)

  return formattedResults
}

classesRoute.get("", async (req: Request, res: Response) => {
  const cacheResults = await redisClient.get('classes');

  let results;

  if (cacheResults) {
    results = JSON.parse(cacheResults);
  } else {
    results = await getClasses();
    await redisClient.setEx('classes', 60 * 60, JSON.stringify(results));
  }

  res.json(results);  
});


