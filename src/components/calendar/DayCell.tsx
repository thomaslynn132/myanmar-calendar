import { format } from "date-fns";
import type { Holiday, MyanmarMonth } from "@/lib/types";
import { TooltipWrapper } from "@/components/ui/tooltip";
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
        {hasFullMoon && <FullMoonIcon />}
        {hasNoMoon && <EclipseIcon />}
      </div>
      {showMyanmarLabel && myanmarMonth && (
        <span className={myanmarLabelClasses}>{myanmarMonth.myanmar_name}</span>
      )}
    </>
  );

  if (holidays.length > 0) {
    return (
      <TooltipWrapper
        content={
          <div className="space-y-1">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                {h.type === "full_mon_day" && <FullMoonIcon />}
                {h.type === "no_moon_day" && <EclipseIcon />}
                <p className="font-medium">{h.label}</p>
              </div>
            ))}
            {myanmarMonth && (
              <p className="text-xs text-muted-foreground pt-1 border-t">{myanmarMonth.myanmar_name}</p>
            )}
          </div>
        }
      >
        <div className={cellClasses}>
          {renderDayContent()}
        </div>
      </TooltipWrapper>
    );
  }

  return (
    <div className={cellClasses}>
      {renderDayContent()}
    </div>
  );
}
