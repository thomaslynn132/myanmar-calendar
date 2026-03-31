import { format, startOfMonth, addDays, startOfWeek, endOfWeek, parseISO } from "date-fns";
import type { Holiday, MyanmarMonth } from "@/lib/types";
import { DayCell } from "./DayCell";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { WEEKDAYS, isWeekendDay } from "@/lib/constants";
import { motion } from "framer-motion";

interface MonthCalendarProps {
  year: number;
  monthIndex: number;
  holidays: Holiday[];
  myanmarMonths: MyanmarMonth[];
  index?: number;
}

export function MonthCalendar({ year, monthIndex, holidays, myanmarMonths, index = 0 }: MonthCalendarProps) {
  const monthStart = startOfMonth(new Date(year, monthIndex));
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const monthName = format(monthStart, "MMMM");
  const holidayMap = new Map<string, Holiday[]>();
  holidays.forEach((h) => {
    const existing = holidayMap.get(h.date) || [];
    existing.push(h);
    holidayMap.set(h.date, existing);
  });

  const getMyanmarMonthsInRange = () => {
    return myanmarMonths.filter((mm) => {
      const start = parseISO(mm.start_date);
      const end = parseISO(mm.end_date);
      const rangeStart = monthStart;
      const rangeEnd = monthEnd;
      return start <= rangeEnd && end >= rangeStart;
    });
  };

  const myanmarMonthsInRange = getMyanmarMonthsInRange();

  const getMyanmarMonthForDay = (date: Date): MyanmarMonth | undefined => {
    const dateStr = formatDate(date);
    return myanmarMonthsInRange.find(
      (mm) => dateStr >= mm.start_date && dateStr <= mm.end_date
    );
  };

  const isFirstDayOfEnglishMonth = (date: Date): boolean => date.getDate() === 1;

  const isFirstDayOfMyanmarMonth = (date: Date): boolean => {
    const dateStr = formatDate(date);
    return myanmarMonthsInRange.some((mm) => mm.start_date === dateStr);
  };

  const getMyanmarMonthLabelForHeader = (): { first?: string; second?: string } => {
    if (myanmarMonthsInRange.length === 0) return {};
    
    const firstMM = myanmarMonthsInRange[0];
    
    if (myanmarMonthsInRange.length === 1) {
      return { first: firstMM.myanmar_name };
    }

    const secondMM = myanmarMonthsInRange[1];
    return { first: firstMM.myanmar_name, second: secondMM.myanmar_name };
  };

  const days: Date[] = [];
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  let current = calendarStart;
  while (current <= calendarEnd) {
    days.push(current);
    current = addDays(current, 1);
  }

  const myanmarLabels = getMyanmarMonthLabelForHeader();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border rounded-lg p-4"
    >
      <div className="text-center mb-3">
        <h3 className="text-base font-semibold text-foreground">
          {monthName} {year}
        </h3>
        {(myanmarLabels.first || myanmarLabels.second) && (
          <div className="flex justify-center gap-2 mt-1">
            {myanmarLabels.first && (
              <span className="text-xs text-blue-600">{myanmarLabels.first}</span>
            )}
            {myanmarLabels.second && (
              <>
                <span className="text-xs text-muted-foreground">-</span>
                <span className="text-xs text-blue-600">{myanmarLabels.second}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center text-[11px] font-medium py-1.5",
              isWeekendDay(index) ? "text-pink-500" : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[2px]">
        {days.map((day, index) => {
          const dateStr = formatDate(day);
          const holidayList = holidayMap.get(dateStr) || [];
          const isCurrentMonth = day.getMonth() === monthIndex;
          const myanmarMonth = getMyanmarMonthForDay(day);

          return (
            <DayCell
              key={index}
              day={day}
              isCurrentMonth={isCurrentMonth}
              holidays={holidayList}
              myanmarMonth={myanmarMonth}
              isFirstDayOfMyanmarMonth={isFirstDayOfMyanmarMonth(day)}
              isFirstDayOfEnglishMonth={isFirstDayOfEnglishMonth(day)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
