import { toast as customAlert } from "react-custom-alert";

// round up {date} to the nearest 30 minutes
export const getRoundedDate = (date) => {
  const coeff = 1000 * 60 * 30; // 30 minutes
  const roundedDate = new Date(Math.ceil(date.getTime() / coeff) * coeff);
  return roundedDate;
};

// add {diff} minutes to {date}
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

// check whether start time is prior to end time (only comapre time, not date)
const compareTimeOnly = (date1, date2) => {
  const time1 = 60 * date1.getHours() + date1.getMinutes();
  const time2 = 60 * date2.getHours() + date2.getMinutes();
  return time1 < time2;
}

// check times and show alerts
export const checkTime = (startDate, startTime, endTime) => {
  if (!startDate) {
    return customAlert.warning("Please choose event date");
  }
  if (!startTime) {
    return customAlert.warning("Please choose start time");
  }
  if (!endTime) {
    return customAlert.warning("Please choose end time");
  }
  if (!compareTimeOnly(startTime, endTime)) {
    return customAlert.warning("Start time must be prior to end time");
  }
  return true;
};