import { differenceInCalendarDays } from "date-fns";
import type { BookingAddon } from "./booking-addons";
import { getResortOffer, getOfferIssue, normalizeExtensionHours, offerCheckoutLabel, type ResortOfferId } from "./resort-offers";

// Owner-selected presentation rates; confirm authoritative rates before enabling payment.
export const RESORT_RATES: Record<string, number> = {"1":800,"2":700,"3":900,"4":1000,"5":1100,"6":900,"7":1000,"8":900,"9":1400,"10":1600};
export const getNightlyRate = (cabinId?: string) => RESORT_RATES[cabinId ?? ""] ?? Math.min(...Object.values(RESORT_RATES));

const number = (value: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(value);
export const nightCountLabel = (nights: number) => nights === 1 ? "ليلة واحدة" : nights === 2 ? "ليلتان" : `${number(nights)} ${nights <= 10 ? "ليال" : "ليلة"}`;

export type ResortPriceContext = { cabinId?: string; offerId?: ResortOfferId | null; extensionHours?: number };
export function getResortPrice(from: string, to: string, addons: BookingAddon[] = [], quantities: Record<string, number> = {}, context: ResortPriceContext = {}) {
 const nights = differenceInCalendarDays(new Date(`${to}T12:00:00`), new Date(`${from}T12:00:00`));
 if (!Number.isFinite(nights) || nights < 1) return null;
 const included = new Set(addons.flatMap(addon => addon.included ?? []));
 const extras = addons.filter(addon => !included.has(addon.id) && (!addon.requiresGroup || addons.some(parent => parent.variantGroup === addon.requiresGroup)));
 const unpriced = extras.filter(addon => addon.price === undefined).map(addon => addon.title);
 const extrasAmount = extras.reduce((sum, addon) => sum + (addon.price ?? 0) * (addon.quantity ? Math.max(1, Math.floor(quantities[addon.id] ?? 1)) : 1), 0);
 const requestedOffer = getResortOffer(context.offerId, context.cabinId);
 const offerIssue = getOfferIssue(requestedOffer, from, to);
 const offer = offerIssue ? null : requestedOffer;
 const nightlyRate = getNightlyRate(context.cabinId);
 const baseStayAmount = nights * nightlyRate;
 const savings = offer ? Math.round(baseStayAmount * offer.discount) / 100 : 0;
 const extensionHours = offer?.shortStay ? normalizeExtensionHours(context.extensionHours ?? 0) : 0;
 const extensionAmount = extensionHours * 40;
 const stayAmount = baseStayAmount - savings + extensionAmount;
 return { nightlyRate, nights, baseStayAmount, savings, stayAmount, extrasAmount, extensionHours, extensionAmount, offer, offerIssue, checkoutLabel: offerCheckoutLabel(offer, extensionHours), total: stayAmount + extrasAmount, unpriced, hasExtras: extras.length > 0 };
}

export type ResortPrice = NonNullable<ReturnType<typeof getResortPrice>>;
