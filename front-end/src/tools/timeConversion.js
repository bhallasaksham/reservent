export const getRoundedDate = (date) => {
  const coeff = 1000 * 60 * 30; // 30 minutes
  const roundedDate = new Date(Math.ceil(date.getTime() / coeff) * coeff); // round up to the nearest 30 minutes
  return roundedDate;
};

export const addMinutes = (date, diff) => {
  const coeff = 1000 * 60; // 1 minute
  return new Date(date.getTime() + diff * coeff);
};