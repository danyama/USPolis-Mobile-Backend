export const getAbbreviatedClassCode = (classCode: string): string => {
  const abbreviatedClassCode = classCode.slice(-2);

  if (abbreviatedClassCode[0] == "0") {
    return abbreviatedClassCode[1];
  }
  return abbreviatedClassCode;
};

export const mapWeekDays = (weekDay: string): string | undefined => {
  const map = new Map<string, string>();
  map.set("seg", "Segunda-feira");
  map.set("ter", "Terça-feira");
  map.set("qua", "Quarta-feira");
  map.set("qui", "Quinta-feira");
  map.set("sex", "Sexta-feira");

  return map.get(weekDay);
};
