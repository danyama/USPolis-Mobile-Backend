import { Prisma } from "@prisma/client";

export type Event = Prisma.eventsGetPayload<{
  select: { [K in keyof Required<Prisma.eventsSelect>]: true };
}>;
