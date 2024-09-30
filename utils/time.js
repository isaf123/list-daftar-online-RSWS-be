export const stripDate = (date) => {
  const getDate = date ? new Date(date) : new Date();

  return getDate.toISOString().split("T")[0];
};
