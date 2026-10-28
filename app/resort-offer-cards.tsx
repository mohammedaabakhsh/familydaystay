"use client";

import { CalendarDays, Clock3, Tag } from "lucide-react";
import { RESORT_OFFERS, type ResortOfferId } from "./resort-offers";
import { getNightlyRate } from "./resort-pricing";
const n = (value: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(value);

export default function ResortOfferCards({onChoose, selected, cabinId, informational = false}: {onChoose?: (id: ResortOfferId) => void; selected?: ResortOfferId | null; informational?: boolean; cabinId?:string}) {
 return <div className="resort-offer-grid">{RESORT_OFFERS.map(offer => <article className={"resort-offer-card" + (selected === offer.id ? " selected" : "")} key={offer.id}>
  <div className="resort-offer-heading"><span className="offer-kind">{offer.shortStay ? "وقت خاص لك" : "إقامة وسط الأسبوع"}</span><span className="offer-discount"><Tag size={14}/>خصم {n(offer.discount)}٪</span></div>
  <h3>{offer.title}</h3>
  {!informational && <div className="resort-offer-price">{!cabinId && <span>يبدأ من</span>}<strong>{n(getNightlyRate(cabinId) * (1 - offer.discount / 100))}<small> ر.س</small></strong><del>{n(getNightlyRate(cabinId))} ر.س</del><span>{offer.shortStay ? "لـ10 ساعات" : "/ ليلة"}</span></div>}
  <ul className="resort-offer-facts"><li><CalendarDays size={16}/>السبت إلى الأربعاء</li><li><Clock3 size={16}/>الدخول 4 عصرًا</li><li><Clock3 size={16}/>الخروج {offer.shortStay ? "2 ليلًا في اليوم التالي" : "12 ظهرًا"}</li></ul>
  <p className="offer-scope">يشمل جميع أكواخ المنتجع</p>
  {offer.shortStay && <p className="offer-extension-info">تحب تطوّل إقامتك؟ التمديد بـ40 ريالًا للساعة حتى 10 صباحًا، حسب التوفر.</p>}
  <details open={informational ? true : undefined} className="resort-offer-terms"><summary>التفاصيل والشروط</summary><ul>{offer.terms.map(term => <li key={term}>{term}</li>)}</ul></details>
  {!informational && onChoose && <button className="primary" onClick={() => onChoose(offer.id)}>{selected === offer.id ? "تعديل موعد العرض" : "اختيار العرض"}</button>}
 </article>)}</div>;
}
