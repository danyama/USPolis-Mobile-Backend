export const getAbbreviatedClassCode = (classCode: string) => {
  const abbreviatedClassCode = classCode.slice(-2);
  if (abbreviatedClassCode.slice(0) == "0") {
    return abbreviatedClassCode.slice(1);
  }
  return abbreviatedClassCode;
};
