import { format, parseISO, isWithinInterval, startOfDay } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const parseDate = (dateString: string): Date => {
  return parseISO(dateString);
};

export const isDateInRange = (
  date: Date,
  startDate: string,
  endDate: string
): boolean => {
  return isWithinInterval(startOfDay(date), {
    start: parseISO(startDate),
    end: parseISO(endDate),
  });
};

export const getMyanmarMonthForDate = (
  date: Date,
  myanmarMonths: { start_date: string; end_date: string; myanmar_name: string }[]
): string | undefined => {
  const dateStr = formatDate(date);
  for (const mm of myanmarMonths) {
    if (dateStr >= mm.start_date && dateStr <= mm.end_date) {
      return mm.myanmar_name;
    }
  }
  return undefined;
};
