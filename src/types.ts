import { Prisma } from "@prisma/client";

export type Event = Prisma.eventsGetPayload<{
  select: { [K in keyof Required<Prisma.eventsSelect>]: true };
}>;

interface ID {
  class_code: string,
  subject_code: string,
  subject_name: string,
  start_period: string,
  end_period: string,
  created_by: string,
  is_active: boolean
}

export interface Schedule {
  id: string,
  week_day: string,
  start_time: string,
  end_time: string,
  building: string,
  classroom: string
}

export interface ListedEvent {
  _id: ID
  schedule: Schedule[]
}
