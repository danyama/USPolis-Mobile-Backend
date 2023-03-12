import { PrismaClient } from "@prisma/client";
import { ListedEvent, Schedule } from "./types";

import MailService from '@sendgrid/mail'

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

export const mapResults = async (prisma: PrismaClient, results: ListedEvent[]) => {
  return Promise.all(results.filter((element) => element._id.created_by === "amelia").map(async (result: ListedEvent) => ({
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

export const sendEmail = async (email: string | undefined, comment: string) => {
  const emailMessage = {
    to: 'uspolis@usp.br',
    from: 'uspolis@usp.br',
    subject: 'Comentário no app USPolis',
    html: `
      <p>Email: ${email ?? "Não informado"}</p>
      <p>Comentário: ${comment}</p>
    `
  }
  try {
    const apiKey = process.env.SENDGRID_API_KEY
    MailService.setApiKey(apiKey!)
    await MailService.send(emailMessage)
    console.log("E-mail enviado com sucesso!");
  } catch (err) {
    console.log(`Erro no envio de email: ${err}`);
  }
}