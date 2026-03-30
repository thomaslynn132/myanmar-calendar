import type { Holiday, MyanmarMonth } from "./types";
import holidaysData from "@/data/holidays.json";
import myanmarMonthsData from "@/data/myanmarMonths.json";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface HolidaysResponse {
  success: boolean;
  data: Holiday[];
  total: number;
}

export interface HolidayResponse {
  success: boolean;
  data: Holiday | null;
}

export interface MyanmarMonthsResponse {
  success: boolean;
  data: MyanmarMonth[];
  total: number;
}

export interface YearsResponse {
  success: boolean;
  data: number[];
}

const simulateApiCall = async <T>(data: T, delayMs: number = 100): Promise<T> => {
  await delay(delayMs);
  return data;
};

export const api = {
  holidays: {
    getAll: async (): Promise<HolidaysResponse> => {
      const data = holidaysData.holidays as Holiday[];
      return simulateApiCall({
        success: true,
        data,
        total: data.length,
      });
    },

    getByYear: async (year: number): Promise<HolidaysResponse> => {
      const data = (holidaysData.holidays as Holiday[]).filter((h) =>
        h.date.startsWith(String(year))
      );
      return simulateApiCall({
        success: true,
        data,
        total: data.length,
      });
    },

    getByDate: async (date: string): Promise<HolidayResponse> => {
      const data = (holidaysData.holidays as Holiday[]).find((h) => h.date === date) || null;
      return simulateApiCall({
        success: true,
        data,
      });
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<HolidaysResponse> => {
      const data = (holidaysData.holidays as Holiday[]).filter(
        (h) => h.date >= startDate && h.date <= endDate
      );
      return simulateApiCall({
        success: true,
        data,
        total: data.length,
      });
    },
  },

  myanmarMonths: {
    getAll: async (): Promise<MyanmarMonthsResponse> => {
      const data = myanmarMonthsData.months as MyanmarMonth[];
      return simulateApiCall({
        success: true,
        data,
        total: data.length,
      });
    },
  },

  years: {
    getAvailable: async (): Promise<YearsResponse> => {
      const holidays = holidaysData.holidays as Holiday[];
      const years = new Set(holidays.map((h) => parseInt(h.date.split("-")[0])));
      return simulateApiCall({
        success: true,
        data: Array.from(years).sort((a, b) => a - b),
      });
    },
  },
};

export const getHolidays = async (): Promise<Holiday[]> => {
  const response = await api.holidays.getAll();
  return response.data;
};

export const getHolidaysByYear = async (year: number): Promise<Holiday[]> => {
  const response = await api.holidays.getByYear(year);
  return response.data;
};

export const getHolidayByDate = async (date: string): Promise<Holiday | null> => {
  const response = await api.holidays.getByDate(date);
  return response.data;
};

export const getMyanmarMonths = async (): Promise<MyanmarMonth[]> => {
  const response = await api.myanmarMonths.getAll();
  return response.data;
};

export const getAvailableYears = async (): Promise<number[]> => {
  const response = await api.years.getAvailable();
  return response.data;
};
