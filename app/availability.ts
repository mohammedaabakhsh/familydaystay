// Read-only integration boundary. No fake occupied dates, prices or reservations.
export type StayAvailability = "available" | "unavailable" | "unknown";
// Cabin-specific checks also carry exact arrival/departure times for short stays.
export type AvailabilityQuery = { arrival: string; departure: string; cabinId?: string; arrivalTime?: string; departureTime?: string };
export type AvailabilityResult = { connection: "connected" | "not_configured" | "error"; stays: { id: string; status: StayAvailability }[] };
export async function loadAvailability(_query: AvailabilityQuery, _signal?: AbortSignal): Promise<AvailabilityResult> {
 // Replace with the real read-only API, checking the ENTIRE requested date range.
 // Missing units remain unknown; they must never be treated as implicitly free.
 return { connection: "not_configured", stays: [] };
}
export function getStayAvailability(id: string, result: AvailabilityResult): StayAvailability {
 if (result.connection !== "connected") return "unknown";
 return result.stays.find(stay => stay.id === id)?.status ?? "unknown";
}

// Night-level calendar for one cabin. Dates are local Jeddah YYYY-MM-DD.
// A booked departure date can be valid: loadAvailability checks [arrival, departure).
export type CabinCalendarResult = {
 connection: AvailabilityResult["connection"];
 days: { date: string; status: StayAvailability }[];
};
export async function loadCabinCalendar(_query: { cabinId: string; month: string }, _signal?: AbortSignal): Promise<CabinCalendarResult> {
 // Connect to authoritative inventory; absent dates remain unknown, never available.
 return { connection: "not_configured", days: [] };
}
