export type HolidayType = "public_holiday" | "full_mon_day" | "no_moon_day";

export interface Holiday {
  id: number;
  date: string;
  label: string;
  type: HolidayType;
}

export interface MyanmarMonth {
  id: number;
  name: string;
  myanmar_name: string;
  start_date: string;
  end_date: string;
}

export interface VisibleMonth {
  year: number;
  month: number;
}
