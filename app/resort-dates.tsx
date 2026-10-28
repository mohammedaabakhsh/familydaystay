"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Tag, X } from "lucide-react";
import { arSA } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { getNightlyRate, getResortPrice, nightCountLabel } from "./resort-pricing";
import { getResortOffer, getOfferIssue, isOfferDay, nextStayDate, normalizeExtensionHours, offerCheckoutLabel, type ResortOfferId } from "./resort-offers";
import { ResortPriceAction } from "./resort-price";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { loadAvailability, loadCabinCalendar, getStayAvailability, type AvailabilityResult, type CabinCalendarResult } from "./availability";

const number = (v: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(v);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const parseDate = (s: string) => new Date(`${s}T12:00:00`);
const today = () => parseDate(new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Riyadh",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()));
const dateLabel = (d?: Date) => d ? d.toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", {day:"numeric",month:"short"}) : "اختر اليوم";
const emptyCalendar: CabinCalendarResult = { connection:"not_configured", days:[] };
type Props = { open: boolean; cabinId?: string; cabinName?: string; from: string; to: string; offerId?: ResortOfferId | null; extensionHours?: number; onClose: () => void; onConfirm: (from: string, to: string, offerId: ResortOfferId | null, extensionHours: number) => void };

export default function ResortDates({open,cabinId,cabinName,from,to,offerId = null,extensionHours = 0,onClose,onConfirm}: Props) {
 const [range,setRange] = useState<DateRange>();
 const [month,setMonth] = useState(today);
 const [draftOfferId,setDraftOfferId] = useState<ResortOfferId | null>(offerId);
 const [extraHours,setExtraHours] = useState(extensionHours);
 const [calendar,setCalendar] = useState<{key:string; result:CabinCalendarResult} | null>(null);
 const [check,setCheck] = useState<{key:string; result:AvailabilityResult} | null>(null);
 const offer = getResortOffer(draftOfferId,cabinId);
 useEffect(() => {
  if (!open) return;
  const initialOffer = getResortOffer(offerId,cabinId);
  setDraftOfferId(initialOffer?.id ?? null);
  setExtraHours(initialOffer?.shortStay ? normalizeExtensionHours(extensionHours) : 0);
  setRange(initialOffer?.shortStay ? from && isOfferDay(parseDate(from)) ? {from:parseDate(from),to:parseDate(nextStayDate(from))} : undefined : from && to ? {from:parseDate(from),to:parseDate(to)} : undefined);
  setMonth(from ? parseDate(from) : today()); setCheck(null);
 }, [open,from,to,cabinId,offerId,extensionHours]);
 const monthKey = dateKey(new Date(month.getFullYear(),month.getMonth(),1));
 const calendarKey = `${cabinId ?? ""}:${monthKey}`;
 useEffect(() => {
  if (!open || !cabinId) return;
  const controller = new AbortController();
  loadCabinCalendar({cabinId,month:monthKey},controller.signal).then(result => { if (!controller.signal.aborted) setCalendar({key:calendarKey,result}); }).catch(() => { if (!controller.signal.aborted) setCalendar({key:calendarKey,result:{connection:"error",days:[]}}); });
  return () => controller.abort();
 }, [open,cabinId,monthKey,calendarKey]);
 const arrival = range?.from ? dateKey(range.from) : "";
 const departure = range?.to ? dateKey(range.to) : "";
 const complete = !!arrival && departure > arrival;
 const offerIssue = complete ? getOfferIssue(offer,arrival,departure) : null;
 const checkKey = `${cabinId ?? "resort"}:${arrival}:${departure}:${offer?.id ?? ""}:${extraHours}`;
 useEffect(() => {
  if (!open || !complete || offerIssue) return;
  const controller = new AbortController();
  const departureTime = offer?.shortStay ? `${String(2+extraHours).padStart(2,"0")}:00` : "12:00";
  loadAvailability({arrival,departure,...(cabinId ? {cabinId,arrivalTime:"16:00",departureTime} : {})},controller.signal).then(result => { if (!controller.signal.aborted) setCheck({key:checkKey,result}); }).catch(() => { if (!controller.signal.aborted) setCheck({key:checkKey,result:{connection:"error",stays:[]}}); });
  return () => controller.abort();
 }, [open,complete,arrival,departure,checkKey,offerIssue,cabinId,offer?.shortStay,extraHours]);
 const result = check?.key === checkKey ? check.result : null;
 const days = calendar?.key === calendarKey ? calendar.result : emptyCalendar;
 const status = cabinId && result ? getStayAvailability(cabinId,result) : "unknown";
 const blocked = status === "unavailable";
 const price = complete ? getResortPrice(arrival,departure,[],{},{cabinId,offerId:offer?.id,extensionHours:extraHours}) : null;
 const dayStatus = (d:Date) => days.connection === "connected" ? days.days.find(day => day.date === dateKey(d))?.status ?? "unknown" : "unknown";
 const sharedCalendar = {
  dir:"rtl" as const, month, onMonthChange:setMonth, locale:arSA, numerals:"latn" as const, showOutsideDays:false,
  modifiers:{available:(d:Date)=>dayStatus(d)==="available",unavailable:(d:Date)=>dayStatus(d)==="unavailable",outsideOffer:(d:Date)=>!!offer&&!isOfferDay(d)},
  modifiersClassNames:{available:"resort-day-available",unavailable:"resort-day-unavailable",outsideOffer:"resort-offer-day-outside"},
  formatters:{formatDay:(d:Date)=>number(d.getDate()),formatCaption:(d:Date)=>d.toLocaleDateString("ar-SA-u-ca-gregory-nu-latn",{month:"long",year:"numeric"})},
  labels:{labelNext:()=>"الشهر التالي",labelPrevious:()=>"الشهر السابق",labelNav:()=>"التنقل بين الأشهر",labelDayButton:(d:Date)=>`${d.toLocaleDateString("ar-SA-u-ca-gregory-nu-latn",{weekday:"long",day:"numeric",month:"long"})}${offer&&!isOfferDay(d)?"، خارج أيام العرض":""}${cabinId ? dayStatus(d)==="available" ? "، ليلة متاحة" : dayStatus(d)==="unavailable" ? "، ليلة محجوزة" : "" : ""}`},className:"fd-calendar"
 };
 return <Sheet open={open} onOpenChange={value => { if (!value) onClose(); }}><SheetContent side="bottom" className="date-sheet resort-date-sheet" showCloseButton={false} dir="rtl">
  <div className="sheet-handle"/>
  <SheetClose asChild><button className="sheet-close icon-button" aria-label="إغلاق التقويم"><X size={23}/></button></SheetClose>
  <SheetTitle>{cabinName ? `مواعيد ${cabinName}` : "اختر موعد إقامتك"}</SheetTitle>
  <SheetDescription>{offer?.shortStay ? "اختر يوم الوصول · المغادرة في اليوم التالي" : cabinName ? "اختر الوصول والمغادرة لهذا الكوخ" : "المنتجع · خليج سلمان"}</SheetDescription>
  <div className="sheet-scroll">
   {offer && <div className="calendar-active-offer"><Tag size={17}/><div><strong>{offer.title}</strong><small>خصم {number(offer.discount)}٪ · السبت إلى الأربعاء</small></div><button className="text-button" onClick={()=>{setDraftOfferId(null);setExtraHours(0);}}>إزالة العرض</button></div>}
   <div className="sheet-date-labels"><span>الوصول · 4 عصرًا<strong>{dateLabel(range?.from)}</strong></span><span>المغادرة · {offerCheckoutLabel(offer,extraHours)}<strong>{dateLabel(range?.to)}</strong></span></div>
   <p className="calendar-instruction" aria-live="polite">{offer?.shortStay ? "اختر يوم الوصول لإقامة 10 ساعات" : !range?.from ? "اختر يوم الوصول أولا" : !complete ? "والآن اختر يوم المغادرة" : `مدة الإقامة: ${nightCountLabel(price?.nights ?? 0)}`}</p>
   {offer?.shortStay ? <Calendar {...sharedCalendar} mode="single" selected={range?.from} disabled={d=>dateKey(d)<dateKey(today())||!isOfferDay(d)} onSelect={day=>setRange(day?{from:day,to:parseDate(nextStayDate(dateKey(day)))}:undefined)}/> : <Calendar {...sharedCalendar} mode="range" min={1} selected={range} onSelect={setRange} disabled={{before:today()}}/>}
   {offer && <p className="calendar-caption">{offer.shortStay ? "لا يشمل العرض الخميس والجمعة أو الإجازات." : "ليالي الخميس والجمعة خارج العرض. يمكن المغادرة يوم الخميس بعد إقامة الأربعاء."}</p>}
   {offer?.shortStay && <label className="offer-extension">تمديد الإقامة <span>40 ر.س لكل ساعة · حسب التوفر</span><select value={extraHours} onChange={event=>setExtraHours(normalizeExtensionHours(Number(event.target.value)))}>{Array.from({length:9},(_,hours)=><option key={hours} value={hours}>{hours===0?"بدون تمديد — الخروج 2 ليلًا":`+ ${number(hours)} ${hours===1?"ساعة":"ساعات"} — ${offerCheckoutLabel(offer,hours)} (+${number(hours*40)} ر.س)`}</option>)}</select></label>}
   {offerIssue && <p className="offer-date-issue" role="status">{offerIssue}</p>}
   {cabinId && days.connection === "connected" ? <><div className="calendar-legend"><span><i className="available-dot"/>ليلة متاحة</span><span><i className="unavailable-dot"/>ليلة محجوزة</span><span><i/>غير مؤكد</span></div><p className="calendar-caption">قد يكون يوم المغادرة محجوزا لضيف آخر. نتحقق من كامل مدة إقامتك بعد اختيارها.</p></> : null}
   {complete && !offerIssue && <p className={"range-status " + (blocked ? "unavailable" : status === "available" ? "available" : "")} role="status">{!result ? "جار التحقق من مدة الإقامة…" : blocked ? "الكوخ غير متاح لكامل هذه المدة. اختر موعدا آخر." : status === "available" ? "الكوخ متاح لكامل مدة إقامتك" : result.connection === "error" ? "تعذر التحقق من الموعد. حاول اختيار الموعد مرة أخرى." : "تم اختيار موعد الإقامة"}</p>}
   {range?.from && <button className="text-button" onClick={()=>setRange(undefined)}>مسح الاختيار</button>}
  </div>
  {cabinId ? <div className="calendar-price-footer"><div><span>{offer ? offer.title : price ? `${number(getNightlyRate(cabinId))} ر.س × ${nightCountLabel(price.nights)}` : cabinId ? "للّيلة الواحدة" : "يبدأ من · لليلة الواحدة"}</span><small>{price?.savings ? `وفّرت ${number(price.savings)} ر.س · قبل الإضافات` : offerIssue ? "الموعد خارج العرض" : offer ? "اختر موعدًا مشمولًا بالعرض" : "قبل الإضافات الاختيارية"}</small></div><ResortPriceAction cabinId={cabinId} price={price} offerPreview={!price && offer ? {amount:Math.round(getNightlyRate(cabinId)*(1-offer.discount/100))+(offer.shortStay?extraHours*40:0),label:offer.shortStay?"سعر 10 ساعات":"سعر الليلة بالعرض"} : undefined}/></div> : <p className="price-caption">تختلف الأسعار حسب الكوخ. اختر موعدك لعرض سعر كل إقامة.</p>}
  <button className="primary" disabled={!complete || !result || blocked || !!offerIssue || result.connection === "error"} onClick={()=>onConfirm(arrival,departure,offer?.id??null,offer?.shortStay?extraHours:0)}><CalendarDays size={18}/>{cabinId ? "تأكيد الموعد والمتابعة" : "عرض الأكواخ لهذا الموعد"}</button>
 </SheetContent></Sheet>;
}
