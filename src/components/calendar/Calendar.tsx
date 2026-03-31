import { useCallback, useEffect, useRef, useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { MonthCalendar } from "./MonthCalendar";
import { CalendarLegend } from "./CalendarLegend";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Moon, Sun } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useTheme } from "@/components/ThemeProvider";
import "swiper/css";
import "swiper/css/free-mode";

export function Calendar() {
  const { theme, toggleTheme } = useTheme();
  const {
    loading,
    currentPage,
    totalPages,
    holidays,
    myanmarMonths,
    startYear,
    endYear,
  } = useCalendar();

  const [activeSlide, setActiveSlide] = useState(currentPage);
  const swiperRef = useRef<any>(null);

  const handleSlideChange = useCallback((swiper: any) => {
    const newPage = swiper.activeIndex;
    setActiveSlide(newPage);
    window.history.pushState({}, "", `?page=${newPage}`);
  }, []);

  const handlePrev = useCallback(() => {
    if (activeSlide > 0) {
      swiperRef.current?.swiper.slideTo(activeSlide - 1);
    }
  }, [activeSlide]);

  const handleNext = useCallback(() => {
    if (activeSlide < totalPages - 1) {
      swiperRef.current?.swiper.slideTo(activeSlide + 1);
    }
  }, [activeSlide, totalPages]);

  useEffect(() => {
    if (swiperRef.current && currentPage !== activeSlide) {
      swiperRef.current.swiper.slideTo(currentPage);
      setActiveSlide(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get("page") || "0", 10);
      if (!isNaN(page) && page >= 0 && page < totalPages) {
        swiperRef.current?.swiper.slideTo(page);
        setActiveSlide(page);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [totalPages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const getCurrentYear = (): number => {
    const monthIndex = activeSlide * 4;
    return startYear + Math.floor(monthIndex / 12);
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Myanmar Calendar
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            <select
              value={getCurrentYear()}
              onChange={(e) => {
                const year = parseInt(e.target.value);
                const page = Math.floor((year - startYear) * 12 / 4);
                swiperRef.current?.swiper.slideTo(page);
                setActiveSlide(page);
                window.history.pushState({}, "", `?page=${page}`);
              }}
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
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={activeSlide === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {activeSlide + 1} / {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={activeSlide === totalPages - 1}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <TooltipProvider>
          <Swiper
            ref={swiperRef}
            modules={[FreeMode]}
            spaceBetween={16}
            slidesPerView={1}
            onSlideChange={handleSlideChange}
            initialSlide={currentPage}
            className="month-swiper"
            wrapperClass="!overflow-visible"
          >
            {Array.from({ length: totalPages }, (_, pageIndex) => {
              const months = [];
              const startMonthIndex = pageIndex * 4;
              for (let i = 0; i < 4; i++) {
                const monthIndex = startMonthIndex + i;
                if (monthIndex >= 72) break;
                const year = startYear + Math.floor(monthIndex / 12);
                const month = monthIndex % 12;
                months.push({ year, month });
              }
              return months;
            }).map((months, pageIndex) => (
              <SwiperSlide key={pageIndex} className="!h-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {months.map(({ year, month }) => (
                    <MonthCalendar
                      key={`${year}-${month}`}
                      year={year}
                      monthIndex={month}
                      holidays={holidays}
                      myanmarMonths={myanmarMonths}
                    />
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </TooltipProvider>

        <CalendarLegend />
      </div>
    </div>
  );
}
