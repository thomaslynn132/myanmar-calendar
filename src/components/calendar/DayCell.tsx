import { format } from "date-fns";
import type { Holiday, MyanmarMonth } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { isWeekendDay } from "@/lib/constants";

interface DayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  holidays?: Holiday[];
  myanmarMonth?: MyanmarMonth;
  isFirstDayOfMyanmarMonth: boolean;
  isFirstDayOfEnglishMonth: boolean;
}

export function DayCell({
  day,
  isCurrentMonth,
  holidays = [],
  myanmarMonth,
  isFirstDayOfMyanmarMonth,
  isFirstDayOfEnglishMonth,
}: DayCellProps) {
  const dayOfWeek = day.getDay();
  const isWeekend = isWeekendDay(dayOfWeek);
  const isToday = formatDate(day) === formatDate(new Date());
  const showMyanmarLabel = isFirstDayOfEnglishMonth || isFirstDayOfMyanmarMonth;

  const hasPublicHoliday = holidays.some(h => h.type === "public_holiday");
  const hasFullMoon = holidays.some(h => h.type === "full_mon_day");
  const hasNoMoon = holidays.some(h => h.type === "no_moon_day");

  const cellClasses = cn(
    "aspect-square flex flex-col items-center justify-center rounded transition-colors relative",
    isWeekend && !isCurrentMonth && "bg-pink-50 dark:bg-pink-950/20 rounded text-pink-300",
    !isWeekend && !isCurrentMonth && "text-muted-foreground/30",
    isCurrentMonth && (isWeekend ? "bg-pink-50 dark:bg-pink-950/20" : "hover:bg-accent/50"),
    isToday && isCurrentMonth && "ring-2 ring-blue-500 ring-inset",
    holidays.length > 0 && "cursor-pointer"
  );

  const dayNumberClasses = cn(
    "text-xs",
    hasPublicHoliday && "text-red-600 font-semibold",
    hasFullMoon && "text-yellow-600 font-semibold",
    hasNoMoon && "text-purple-600 font-semibold",
    holidays.length === 0 && isWeekend && "text-pink-600",
    holidays.length === 0 && !isWeekend && "text-foreground"
  );

  const FullMoonIcon = () => (
    <div className="w-2 h-2 rounded-full bg-yellow-400" />
  );

  const NoMoonIcon = () => (
    <div className="w-2 h-2 rounded-full border border-purple-500 bg-white/70" />
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
        {hasFullMoon && <FullMoonIcon />}
        {hasNoMoon && <NoMoonIcon />}
      </div>
      {showMyanmarLabel && myanmarMonth && (
        <span className={myanmarLabelClasses}>{myanmarMonth.myanmar_name}</span>
      )}
    </>
  );

  if (holidays.length > 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cellClasses}>
            {renderDayContent()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                {h.type === "full_mon_day" && <FullMoonIcon />}
                {h.type === "no_moon_day" && <NoMoonIcon />}
                <p className="font-medium">{h.label}</p>
              </div>
            ))}
            {myanmarMonth && (
              <p className="text-xs text-muted-foreground pt-1 border-t">{myanmarMonth.myanmar_name}</p>
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
