import { getNightlyRate, nightCountLabel, type ResortPrice } from "./resort-pricing";
import { Tag, Clock3 } from "lucide-react";

const number = (value: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(value);

export function NightlyPrice({cabinId}: {cabinId?: string}) {
 return <span className="nightly-price"><strong>{number(getNightlyRate(cabinId))} <span>ر.س</span></strong><small>/ ليلة</small></span>;
}

export function ResortPriceSummary({price, cabinId, withExtras = false}: {price: ResortPrice | null; cabinId?:string; withExtras?: boolean}) {
 const partial = withExtras && !!price?.unpriced.length;
 return <section className="resort-price-summary" aria-label="سعر الإقامة">
  <div className="price-summary-heading"><span>{withExtras ? "ملخص السعر" : "سعر الإقامة"}</span></div>
  {price ? <>
   {price.offer && <div className="applied-resort-offer"><Tag size={19}/><div><strong>{price.offer.title}</strong><small>وفّرت {number(price.savings)} ر.س على الإقامة</small></div></div>}
   {price.offerIssue && <p className="offer-date-issue" role="status">{price.offerIssue} السعر المعروض هو السعر الأساسي.</p>}
   <dl className="price-breakdown">
    <div><dt>{price.offer?.shortStay ? "سعر الإقامة الأساسي" : `${number(price.nightlyRate)} ر.س × ${nightCountLabel(price.nights)}`}</dt><dd>{number(price.baseStayAmount)} ر.س</dd></div>
    {price.offer && <div className="offer-saving"><dt>خصم {number(price.offer.discount)}٪</dt><dd>−{number(price.savings)} ر.س</dd></div>}
    {price.extensionHours > 0 && <div><dt>تمديد {number(price.extensionHours)} {price.extensionHours === 1 ? "ساعة" : "ساعات"}</dt><dd>{number(price.extensionAmount)} ر.س</dd></div>}
    {withExtras && <div><dt>{partial ? "الإضافات المسعّرة" : "الإضافات"}</dt><dd>{price.hasExtras ? partial && price.extrasAmount === 0 ? "بانتظار التسعير" : `${number(price.extrasAmount)} ر.س` : "دون إضافات"}</dd></div>}
    <div className="price-total"><dt>{partial ? "المجموع الجزئي" : withExtras ? "الإجمالي" : "إجمالي الإقامة"}</dt><dd>{number(withExtras ? price.total : price.stayAmount)} <span>ر.س</span></dd></div>
   </dl>
   {price.offer && <p className="offer-stay-times"><Clock3 size={15}/>الدخول 4 عصرًا · الخروج {price.checkoutLabel}{price.offer.shortStay ? " في اليوم التالي" : ""}</p>}
   {partial && <p className="price-pending">لا يشمل المجموع: {price.unpriced.join("، ")} — أسعارها بانتظار التحديد.</p>}
  </> : <NightlyPrice cabinId={cabinId}/>}
  {!withExtras && <p className="price-caption">{price ? "قبل التنسيق والضيافة والإضافات الاختيارية." : "حدد موعدك لعرض إجمالي الإقامة قبل الإضافات."}</p>}
 </section>;
}

export function ResortPriceAction({price, cabinId, withExtras = false, onEditDates, offerPreview}: {price: ResortPrice | null; cabinId?:string; withExtras?: boolean; onEditDates?: () => void; offerPreview?: {amount:number; label:string}}) {
 const partial = withExtras && !!price?.unpriced.length;
 return <div className="booking-price-action">
  <small>{price ? partial ? "المجموع الجزئي" : withExtras ? "الإجمالي" : "إجمالي الإقامة" : offerPreview?.label ?? "سعر الليلة"}{price?.offer && <span className="sticky-offer-title">{price.offer.shortStay ? "10 ساعات" : "وسط الأسبوع"}</span>}</small>
  <strong>{number(price ? withExtras ? price.total : price.stayAmount : offerPreview?.amount ?? getNightlyRate(cabinId))} <span>ر.س</span></strong>
  {price && onEditDates && <button className="text-button" onClick={onEditDates}>تعديل الموعد</button>}
  {partial && <small>توجد إضافات لم تُسعّر بعد</small>}
 </div>;
}
