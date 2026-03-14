export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const difference = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)));
};
