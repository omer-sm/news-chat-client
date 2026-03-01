export const zpad = (str: string, length: number) => {
  return str.length >= length ? str : '0'.repeat(length - str.length) + str;
};
