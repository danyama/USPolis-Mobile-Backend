export const getAbbreviatedClassCode = (classCode: string) => {
  const abbreviatedClassCode = classCode.slice(-2);

  if (abbreviatedClassCode[0] == "0") {
    return abbreviatedClassCode[1];
  }
  return abbreviatedClassCode;
};
