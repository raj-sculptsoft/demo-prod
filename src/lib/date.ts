export const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
};
