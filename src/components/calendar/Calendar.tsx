import { useCalendar } from "@/hooks/useCalendar";
import { MonthCalendar } from "./MonthCalendar";
import { Navigation } from "./Navigation";
import { CalendarLegend } from "./CalendarLegend";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export function Calendar() {
  const {
    loading,
    currentPage,
    totalPages,
    currentVisibleMonths,
    holidays,
    myanmarMonths,
    goToNextPage,
    goToPrevPage,
    goToYear,
    canGoNext,
    canGoPrev,
    startYear,
    endYear,
  } = useCalendar();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading calendar...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Myanmar Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentPage + 1} / {totalPages}
          </p>
        </motion.div>

        <Navigation
          currentPage={currentPage + 1}
          totalPages={totalPages}
          currentVisibleMonths={currentVisibleMonths}
          canGoPrev={canGoPrev()}
          canGoNext={canGoNext()}
          onPrev={goToPrevPage}
          onNext={goToNextPage}
          onYearChange={goToYear}
          startYear={startYear}
          endYear={endYear}
        />

        <TooltipProvider>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, staggerChildren: 0.05 }}
          >
            <AnimatePresence mode="popLayout">
              {currentVisibleMonths.map(({ year, month }, index) => (
                <MonthCalendar
                  key={`${year}-${month}`}
                  year={year}
                  monthIndex={month}
                  holidays={holidays}
                  myanmarMonths={myanmarMonths}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </TooltipProvider>

        <CalendarLegend />
      </div>
    </div>
  );
}
