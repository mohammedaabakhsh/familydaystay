"use client";
import { useState } from "react";
import type { BookingAddon } from "./booking-addons";
const n=(v:number)=>new Intl.NumberFormat("ar-SA-u-nu-latn").format(v);
export default function VariantAddon({options,selectedId,included,onChoose}:{options:BookingAddon[];selectedId?:string;included:string[];onChoose:(addon:BookingAddon)=>void}) {
 const [draftId,setDraftId]=useState(selectedId??"");
 const picked=options.find(a=>a.id===selectedId),draft=options.find(a=>a.id===draftId&&!included.includes(a.id));
 const cinema=options[0].variantGroup==="cinema";
 return <div className="extra-row"><div className="extra-row-main"><strong>{cinema?"جلسة السينما":"الألعاب الجماعية"}</strong><span className="extra-price">{draft?n(draft.price!):`من ${n(Math.min(...options.map(a=>a.price!)))}`} ر.س</span></div>{cinema&&<p className="extras-hint">{options[0].description}</p>}<p className="extras-hint">{cinema?"اختر الفترة":"اختر التجهيز المناسب لك"}</p><div className="extra-variants">{options.map(a=><button type="button" key={a.id} disabled={included.includes(a.id)} aria-pressed={draftId===a.id} className={draftId===a.id?"selected":""} onClick={()=>setDraftId(a.id)}>{a.variantLabel}{!cinema&&<small>{a.description}</small>}<small>{included.includes(a.id)?"مشمول في باقتك":`${n(a.price!)} ر.س`}</small></button>)}</div>{!cinema&&<details className="extra-details"><summary>محتويات البوكس</summary><ul>{options[0].details.map(item=><li key={item}>{item}</li>)}</ul></details>}{picked&&<p className="extras-hint" role="status">المضاف: {picked.title}</p>}<div className="service-actions"><button type="button" className="extra-add" disabled={!draft} onClick={()=>draft&&onChoose(draft)}>{picked?.id===draft?.id&&picked?"إزالة":picked?"تحديث الاختيار":"إضافة"}</button>{picked&&picked.id!==draft?.id&&<button type="button" className="text-button" onClick={()=>onChoose(picked)}>إزالة</button>}</div></div>;
}
