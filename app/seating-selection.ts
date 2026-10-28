import { BOOKING_ADDONS } from "./booking-addons";
export const SEATING_OPTIONS = BOOKING_ADDONS.filter(addon => addon.variantGroup === "outdoor").sort((a,b)=>a.capacity!-b.capacity!);
export const SEATING_CAKE = BOOKING_ADDONS.find(addon => addon.id === "seating-cake")!;
export function selectSeating(selected:string[],id:string) {
 if (!SEATING_OPTIONS.some(option=>option.id===id)) return selected;
 const removing=selected.includes(id);
 return [...selected.filter(key=>!SEATING_OPTIONS.some(option=>option.id===key)&&(!removing||key!==SEATING_CAKE.id)),...(!removing?[id]:[])];
}
