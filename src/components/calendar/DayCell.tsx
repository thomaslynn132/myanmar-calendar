import { format } from "date-fns";
import type { Holiday, MyanmarMonth, HolidayType } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { isWeekendDay } from "@/lib/constants";

interface DayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  holiday?: Holiday;
  myanmarMonth?: MyanmarMonth;
  isFirstDayOfMyanmarMonth: boolean;
  isFirstDayOfEnglishMonth: boolean;
}

const isHolidayType = (type: HolidayType | undefined, check: HolidayType): boolean => {
  return type === check;
};

export function DayCell({
  day,
  isCurrentMonth,
  holiday,
  myanmarMonth,
  isFirstDayOfMyanmarMonth,
  isFirstDayOfEnglishMonth,
}: DayCellProps) {
  const dayOfWeek = day.getDay();
  const isWeekend = isWeekendDay(dayOfWeek);
  const isToday = formatDate(day) === formatDate(new Date());
  const showMyanmarLabel = isFirstDayOfEnglishMonth || isFirstDayOfMyanmarMonth;

  const { type: holidayType } = holiday ?? {};

  const cellClasses = cn(
    "aspect-square flex flex-col items-center justify-center rounded transition-colors relative",
    isWeekend && !isCurrentMonth && "bg-pink-50 dark:bg-pink-950/20 rounded text-pink-300",
    !isWeekend && !isCurrentMonth && "text-muted-foreground/30",
    isCurrentMonth && (isWeekend ? "bg-pink-50 dark:bg-pink-950/20" : "hover:bg-accent/50"),
    isToday && isCurrentMonth && "ring-2 ring-blue-500 ring-inset",
    holiday && "cursor-pointer"
  );

  const dayNumberClasses = cn(
    "text-xs",
    isHolidayType(holidayType, "public_holiday") && "text-red-600 font-semibold",
    isHolidayType(holidayType, "full_mon_day") && "text-yellow-600 font-semibold",
    isHolidayType(holidayType, "no_moon_day") && "text-purple-600 font-semibold",
    !holiday && isWeekend && "text-pink-600",
    !holiday && !isWeekend && "text-foreground"
  );

  const FullMoonIcon = () => (
    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm" />
  );

  const EclipseIcon = () => (
    <div className="w-2.5 h-2.5 rounded-full border-2 border-purple-500 bg-white/70 shadow-sm" />
  );

  if (!isCurrentMonth) {
    return (
      <div className={cellClasses}>
        <span className="text-xs text-muted-foreground/30">{format(day, "d")}</span>
      </div>
    );
  }

  const myanmarLabelClasses = "text-[8px] text-blue-500 font-medium absolute bottom-0.5";

  const renderDayContent = () => (
    <>
      <div className="flex items-start justify-center gap-0.5">
        <span className={dayNumberClasses}>{format(day, "d")}</span>
        {isHolidayType(holidayType, "full_mon_day") && <FullMoonIcon />}
        {isHolidayType(holidayType, "no_moon_day") && <EclipseIcon />}
      </div>
      {showMyanmarLabel && myanmarMonth && (
        <span className={myanmarLabelClasses}>{myanmarMonth.myanmar_name}</span>
      )}
    </>
  );

  if (holiday) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cellClasses}>
            {renderDayContent()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-0.5">
            <p className="font-medium">{holiday.label}</p>
            <p className="text-xs text-muted-foreground">{holiday.type.replace(/_/g, " ")}</p>
            {myanmarMonth && (
              <p className="text-xs text-muted-foreground">{myanmarMonth.myanmar_name}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className={cellClasses}>
      {renderDayContent()}
    </div>
  );
}
