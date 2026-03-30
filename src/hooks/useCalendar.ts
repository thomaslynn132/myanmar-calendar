import { useState, useEffect, useMemo, useCallback } from "react";
import type { Holiday, MyanmarMonth, VisibleMonth } from "@/lib/types";
import { getHolidays, getMyanmarMonths } from "@/lib/calendar-utils";
import { START_YEAR, END_YEAR, MONTHS_PER_PAGE, TOTAL_MONTHS } from "@/lib/constants";

const getSearchParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

const setSearchParam = (key: string, value: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new Event("popstate"));
};

const getPageFromURL = (): number | null => {
  const pageParam = getSearchParams().get("page");
  if (pageParam) {
    const page = parseInt(pageParam, 10);
    if (!isNaN(page) && page >= 0) return page;
  }
  return null;
};

export const useCalendar = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [myanmarMonths, setMyanmarMonths] = useState<MyanmarMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const page = getPageFromURL();
    if (page !== null) setCurrentPage(page);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromURL();
      if (page !== null) setCurrentPage(page);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [holidaysData, myanmarMonthsData] = await Promise.all([
        getHolidays(),
        getMyanmarMonths(),
      ]);
      setHolidays(holidaysData);
      setMyanmarMonths(myanmarMonthsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const holidayMap = useMemo(() => new Map(holidays.map((h) => [h.date, h])), [holidays]);

  const totalPages = Math.ceil(TOTAL_MONTHS / MONTHS_PER_PAGE);

  const getPageForDate = useCallback((date: Date): number => {
    const monthIndex = (date.getFullYear() - START_YEAR) * 12 + date.getMonth();
    return Math.floor(monthIndex / MONTHS_PER_PAGE);
  }, []);

  useEffect(() => {
    if (currentPage === 0 && !getSearchParams().get("page")) {
      const defaultPage = getPageForDate(new Date());
      if (defaultPage > 0) {
        setSearchParam("page", String(defaultPage));
        setCurrentPage(defaultPage);
      }
    }
  }, [getPageForDate, currentPage]);

  const getVisibleMonths = useCallback((page: number): VisibleMonth[] => {
    const months: VisibleMonth[] = [];
    const startMonthIndex = page * MONTHS_PER_PAGE;

    for (let i = 0; i < MONTHS_PER_PAGE; i++) {
      const monthIndex = startMonthIndex + i;
      if (monthIndex >= TOTAL_MONTHS) break;
      months.push({
        year: START_YEAR + Math.floor(monthIndex / 12),
        month: monthIndex % 12,
      });
    }

    return months;
  }, []);

  const currentVisibleMonths = useMemo(() => getVisibleMonths(currentPage), [currentPage, getVisibleMonths]);

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setSearchParam("page", String(currentPage + 1));
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setSearchParam("page", String(currentPage - 1));
      setCurrentPage(currentPage - 1);
    }
  };

  const goToYear = (year: number) => {
    const page = Math.floor((year - START_YEAR) * 12 / MONTHS_PER_PAGE);
    setSearchParam("page", String(page));
    setCurrentPage(page);
  };

  return {
    loading,
    currentPage,
    totalPages,
    currentVisibleMonths,
    holidays,
    holidayMap,
    myanmarMonths,
    goToNextPage,
    goToPrevPage,
    goToYear,
    canGoNext: () => currentPage < totalPages - 1,
    canGoPrev: () => currentPage > 0,
    startYear: START_YEAR,
    endYear: END_YEAR,
  };
};
