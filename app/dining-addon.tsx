"use client";
import { useState } from "react";
import type { BookingAddon } from "./booking-addons";
const n=(value:number)=>new Intl.NumberFormat("ar-SA-u-nu-latn").format(value);
export default function DiningAddon({options,selectedId,onChoose}:{options:BookingAddon[];selectedId?:string;onChoose:(addon:BookingAddon)=>void}) {
 const chosen=options.find(option=>option.id===selectedId);
 const [people,setPeople]=useState(chosen?.capacity??6);
 const [setup,setSetup]=useState(chosen?.id.endsWith("-decorated")?"decorated":chosen?"plain":"");
 const draft=options.find(option=>option.id===`dining-${people}-${setup}`);
 const committed=!!draft&&chosen?.id===draft.id;
 const decorated=options.find(option=>option.id===`dining-${people}-decorated`)!;
 return <div className="dining-picker">
  <p className="extras-hint">جلسة طعام خارجية تناسب مختلف المناسبات</p>
  <fieldset className="dining-count"><legend>كم شخص؟</legend><div>{[6,12,18,24,32].map(count=><button key={count} type="button" aria-pressed={people===count} className={people===count?"selected":""} onClick={()=>setPeople(count)}>{n(count)}</button>)}</div></fieldset>
  <fieldset className="dining-setup"><legend>اختر التجهيز</legend><div className="extra-variants">{["plain","decorated"].map(kind=>{const option=options.find(item=>item.id===`dining-${people}-${kind}`)!;return <button key={kind} type="button" aria-pressed={setup===kind} className={setup===kind?"selected":""} onClick={()=>setSetup(kind)}><strong>{option.variantLabel}</strong><small>{option.description}</small><span>{n(option.price!)} ر.س</span></button>;})}</div></fieldset>
  <details className="extra-details"><summary>ماذا يشمل التنسيق؟</summary><ul>{decorated.details.map(item=><li key={item}>{item}</li>)}</ul></details>
  {chosen&&<p className="dining-current" role="status">المضاف: {n(chosen.capacity!)} شخصًا · {chosen.variantLabel} · {n(chosen.price!)} ر.س</p>}
  <div className="dining-footer"><div aria-live="polite"><small>{draft?`لـ${n(people)} شخصًا · ${draft.variantLabel}`:"اختر التجهيز"}</small>{draft&&<strong>{n(draft.price!)} <small>ر.س</small></strong>}</div><button type="button" className="extra-add" disabled={!draft} onClick={()=>draft&&onChoose(draft)}>{committed?"إزالة":chosen?"تحديث الاختيار":"إضافة"}</button>{chosen&&!committed&&<button type="button" className="text-button" onClick={()=>onChoose(chosen)}>إزالة</button>}</div>
 </div>;
}
