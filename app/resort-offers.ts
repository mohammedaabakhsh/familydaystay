import { addDays, differenceInCalendarDays, format } from "date-fns";

export type ResortOfferId = "ten-hours" | "midweek";
export type ResortOffer = { id: ResortOfferId; title: string; discount: number; shortStay: boolean; timeLabel: string; terms: string[] };
// Both percentage offers apply to all ten resort cabins.
export const RESORT_OFFERS: ResortOffer[] = [
 { id: "ten-hours", title: "عرض 10 ساعات", discount: 45, shortStay: true, timeLabel: "4 عصرًا — 2 ليلًا", terms: ["من السبت إلى الأربعاء، باستثناء الإجازات.", "إقامة لمدة 10 ساعات، والخروج الساعة 2 ليلًا من اليوم التالي.", "التمديد اختياري: 40 ريالًا للساعة، حتى الساعة 10 صباحًا كحد أقصى، حسب التوفر.", "الخصم على الإقامة فقط، ولا يشمل الإضافات أو ساعات التمديد."] },
 { id: "midweek", title: "عرض وسط الأسبوع", discount: 25, shortStay: false, timeLabel: "4 عصرًا — 12 ظهرًا", terms: ["من السبت إلى الأربعاء على جميع أكواخ المنتجع.", "يجب أن تكون جميع ليالي الإقامة ضمن أيام العرض.", "الخروج الساعة 12 ظهرًا من اليوم التالي لآخر ليلة.", "الخصم على الإقامة فقط، ولا يجمع مع عرض آخر."] },
];

// Populate from the owner's authoritative holiday/blackout calendar before live booking.
// No holiday dates or campaign expiry were supplied; never invent them.
export const RESORT_OFFER_EXCLUDED_DATES: string[] = [];
export const parseStayDate = (date: string) => new Date(`${date}T12:00:00`);
export const nextStayDate = (date: string) => format(addDays(parseStayDate(date), 1), "yyyy-MM-dd");
export const getResortOffer = (id?: string | null, cabinId?: string) => !!cabinId && /^(?:[1-9]|10)$/.test(cabinId) ? RESORT_OFFERS.find(offer => offer.id === id) ?? null : null;
export const isOfferDay = (date: Date, excludedDates = RESORT_OFFER_EXCLUDED_DATES) => ![4,5].includes(date.getDay()) && !excludedDates.includes(format(date, "yyyy-MM-dd"));

export function getOfferIssue(offer: ResortOffer | null, from: string, to: string, excludedDates = RESORT_OFFER_EXCLUDED_DATES): string | null {
 if (!offer) return null;
 const start = parseStayDate(from), end = parseStayDate(to);
 const nights = differenceInCalendarDays(end, start);
 if (!Number.isFinite(nights) || nights < 1) return "اختر موعد الإقامة لتطبيق العرض.";
 if (offer.shortStay && nights !== 1) return "عرض 10 ساعات لإقامة واحدة. اختر يوم الوصول فقط.";
 for (let i = 0; i < nights; i++) {
  if (!isOfferDay(addDays(start, i), excludedDates)) return "هذا الموعد خارج أيام العرض. اختر من السبت إلى الأربعاء أو تابع بالسعر الأساسي.";
 }
 return null;
}

export const normalizeExtensionHours = (hours: number) => Number.isFinite(hours) ? Math.max(0, Math.min(8, Math.floor(hours))) : 0;
export function offerCheckoutLabel(offer: ResortOffer | null, hours = 0) {
 if (!offer?.shortStay) return "12 ظهرًا";
 const hour = 2 + normalizeExtensionHours(hours);
 return hour === 2 ? "2 ليلًا" : `${new Intl.NumberFormat("ar-SA-u-nu-latn").format(hour)} صباحًا`;
}
