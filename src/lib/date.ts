import moment from "moment-timezone";

export const getFormattedDate = (dateString?: string) => {
  if (!dateString) return "N/A";

  // Automatically detect the system's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert to Moment Object in UTC
  const date = moment.utc(dateString);
  if (!date.isValid()) return "Invalid Date";

  // Convert to the system's timezone
  const formattedDateTime = date.tz(userTimeZone).format("MM-DD-YYYY HH:mm:ss");

  return formattedDateTime;
};
