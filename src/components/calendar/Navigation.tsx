import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  currentVisibleMonths: { year: number; month: number }[];
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onYearChange: (year: number) => void;
  startYear: number;
  endYear: number;
}

export function Navigation({ 
  currentPage, 
  totalPages, 
  currentVisibleMonths,
  canGoPrev, 
  canGoNext,
  onPrev, 
  onNext, 
  onYearChange,
  startYear,
  endYear,
}: NavigationProps) {
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const getCurrentYear = (): number => {
    return currentVisibleMonths.length > 0 ? currentVisibleMonths[0].year : startYear;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <select
          value={getCurrentYear()}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={!canGoPrev}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={onNext} disabled={!canGoNext}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
