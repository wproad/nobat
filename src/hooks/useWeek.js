import { useMemo, useState, useCallback } from "@wordpress/element";

const getWeekDates = (date, startOfWeekIndex) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const daysSinceStart = (day - startOfWeekIndex + 7) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - daysSinceStart);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    dates.push(currentDate);
  }
  return dates;
};

export const useWeek = ({ startOfWeekIndex }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekDates = useMemo(
    () => getWeekDates(currentWeek, startOfWeekIndex),
    [currentWeek, startOfWeekIndex]
  );

  const isCurrentWeek = useMemo(() => {
    const today = new Date();
    return weekDates.some((d) => d.toDateString() === today.toDateString());
  }, [weekDates]);

  const goPrevWeek = useCallback(() => {
    setCurrentWeek((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  }, []);

  const goNextWeek = useCallback(() => {
    setCurrentWeek((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeek(new Date());
  }, []);

  return {
    currentWeek,
    setCurrentWeek,
    weekDates,
    isCurrentWeek,
    goPrevWeek,
    goNextWeek,
    goToToday,
  };
};
