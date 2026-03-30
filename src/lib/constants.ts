export const START_YEAR = 2021;
export const END_YEAR = 2026;
export const MONTHS_PER_PAGE = 4;

export const TOTAL_YEARS = END_YEAR - START_YEAR + 1;
export const TOTAL_MONTHS = TOTAL_YEARS * 12;
export const TOTAL_PAGES = Math.ceil(TOTAL_MONTHS / MONTHS_PER_PAGE);

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const isWeekendDay = (day: number): boolean => day === 0 || day === 6;
