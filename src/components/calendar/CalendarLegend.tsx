export function CalendarLegend() {
  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold">Text</span>
          <span>= Public Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span>= Full Moon Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full border border-purple-500" />
          <span>= Eclipse</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-200 dark:bg-pink-800" />
          <span>= Weekend</span>
        </div>
      </div>
    </div>
  );
}
