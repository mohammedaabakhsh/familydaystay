"use client";
import { useState } from "react";
import type { BookingAddon } from "./booking-addons";

export default function BarbecueAddon({options,selectedId,onChoose}:{options:BookingAddon[];selectedId?:string;onChoose:(addon:BookingAddon)=>void}) {
 const [meat,setMeat]=useState(selectedId?.includes("-beef-")?"beef":selectedId?.includes("-chicken-")?"chicken":"");
 const [charcoal,setCharcoal]=useState(selectedId?.endsWith("-coal")?"coal":selectedId?.endsWith("-plain")?"plain":"");
 const chosen=options.find(a=>a.id===selectedId);
 const draft=options.find(a=>a.id===`bbq-${meat}-${charcoal}`);
 const committed=!!chosen && chosen.id===draft?.id;
 return <div className="extra-row">
  <div className="extra-row-main"><strong>بوكس الشواء</strong><span className="extra-price">{charcoal==="coal"?"120":charcoal==="plain"?"85":"من 85"} ر.س</span></div>
  <p className="extras-hint">مناسب لـ6 أشخاص · يشمل خبزًا وجبنًا وصوصات</p>
  <fieldset className="bbq-options"><legend>نوع البوكس</legend><div className="extra-variants">{[["beef","لحم"],["chicken","دجاج"]].map(([id,label])=><button type="button" key={id} aria-pressed={meat===id} className={meat===id?"selected":""} onClick={()=>setMeat(id)}>{label}</button>)}</div></fieldset>
  <fieldset className="bbq-options"><legend>التجهيز</legend><div className="extra-variants">{[["plain","بدون فحم","85"],["coal","مع الفحم","120"]].map(([id,label,price])=><button type="button" key={id} aria-pressed={charcoal===id} className={charcoal===id?"selected":""} onClick={()=>setCharcoal(id)}>{label}<small>{price} ر.س</small></button>)}</div></fieldset>
  {chosen&&<p className="extras-hint" role="status">المضاف: {chosen.title.replace("بوكس الشواء · ","")}</p>}
  <div className="bbq-actions"><button type="button" className="extra-add" disabled={!draft} onClick={()=>draft&&onChoose(draft)}>{committed?"إزالة":chosen?"تحديث الاختيار":"إضافة"}</button>{chosen&&!committed&&<button type="button" className="text-button" onClick={()=>onChoose(chosen)}>إزالة</button>}</div>
 </div>;
}
