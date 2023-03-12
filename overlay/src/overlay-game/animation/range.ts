export const rangeArray = (start: number, end: number) => {
  const length = end - start;
  if (length < 0) return [];
  return Array.from({ length }, (_, i) => start + i);
};
