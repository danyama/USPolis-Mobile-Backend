import { PrismaClient } from "@prisma/client";
import { ListedEvent, Schedule } from "./types";

const getAbbreviatedClassCode = (classCode: string): string => {
  const abbreviatedClassCode = classCode.slice(-2);

  if (abbreviatedClassCode[0] == "0") {
    return abbreviatedClassCode[1];
  }
  return abbreviatedClassCode;
};

const mapWeekDays = (weekDay: string): string | undefined => {
  const map = new Map<string, string>();
  map.set("seg", "Segunda-feira");
  map.set("ter", "Terça-feira");
  map.set("qua", "Quarta-feira");
  map.set("qui", "Quinta-feira");
  map.set("sex", "Sexta-feira");

  return map.get(weekDay);
};

const findFloor = async (prisma: PrismaClient, classroom_name: string, building: string) => {
  const result = await prisma.classrooms.findFirst({
    where: {
      classroom_name,
      building
    }
  })

  return result?.floor
}

export const mapResults = async (results: ListedEvent[]) => {
  const prisma = new PrismaClient();
  return Promise.all(results.map(async (result: ListedEvent) => ({
    ...result._id,
    id: `${result._id.subject_code}_${result._id.class_code}`,
    class_code: getAbbreviatedClassCode(result._id.class_code),
    schedule: await Promise.all(result.schedule.map(async (day: Schedule) => {
      return {
        ...day,
        week_day: mapWeekDays(day.week_day),
        floor: await findFloor(prisma, day.classroom, day.building)
      }
    }))
  })))
}