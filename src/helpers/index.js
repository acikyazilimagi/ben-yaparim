export const formatDate = (date) => {
  return date?.toDate().toLocaleString().split(",")[0];
};
