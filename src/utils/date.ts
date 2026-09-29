import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { id } from "date-fns/locale";

export const toISODate = (d: Date) => format(d, "yyyy-MM-dd");
export const todayISO = () => toISODate(new Date());
export const nowTime = () => format(new Date(), "HH:mm");
export const currentMonth = () => todayISO().slice(0, 7);

/** "29 Sep 2026" */
export const formatDate = (iso: string) => format(parseISO(iso), "d MMM yyyy", { locale: id });
/** "29 September 2026" */
export const formatDateLong = (iso: string) => format(parseISO(iso), "d MMMM yyyy", { locale: id });
/** "Selasa, 29 September 2026" */
export const formatDateHeading = (iso: string) => format(parseISO(iso), "EEEE, d MMMM yyyy", { locale: id });
/** "September 2026" from "2026-09" */
export const formatMonth = (month: string) => format(parseISO(`${month}-01`), "MMMM yyyy", { locale: id });
export const formatMonthShort = (month: string) => format(parseISO(`${month}-01`), "MMM", { locale: id });
export const formatDayShort = (iso: string) => format(parseISO(iso), "d MMM", { locale: id });
export const formatDateTime = (iso: string) => format(parseISO(iso), "d MMM yyyy, HH:mm", { locale: id });

export const daysUntil = (iso: string) => differenceInCalendarDays(parseISO(iso), new Date());
