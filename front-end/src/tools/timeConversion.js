export const getRoundedDate = (date) => {
  const coeff = 1000 * 60 * 30; // 30 minutes
  const roundedDate = new Date(Math.ceil(date.getTime() / coeff) * coeff); // round up to the nearest 30 minutes
  return roundedDate;
};

export const addMinutes = (date, diff) => {
  const coeff = 1000 * 60; // 1 minute
  return new Date(date.getTime() + diff * coeff);
};

export const formatTime = (date, time) => {
  const dateString = date.toString().slice(0, 15);
  const timeString = time.toString().slice(16, 24);
  const timeZoneFormat = date.toString().slice(25, 28);
  const timeZoneValue = date.toString().slice(28, 33);
  return dateString + " " + timeString + " " + timeZoneFormat + " " + timeZoneValue;
}

export const getDate = (date) => {
  return date ? date.toString().slice(4, 15) : "";
}

export const getTime = (date) => {
  return date ? date.toString().slice(16, 21) : "";
}