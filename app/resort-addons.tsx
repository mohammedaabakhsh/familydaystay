"use client";
import VariantAddon from "./variant-addon";
import AddonItem from "./addon-item";
import DiningAddon from "./dining-addon";
import SeatingAddons from "./seating-addons";
import BarbecueAddon from "./barbecue-addon";
import { UtensilsCrossed, Coffee, Flower2, Armchair, Gamepad2, Bath, Check, Plus, Minus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BOOKING_ADDONS, type BookingAddon } from "./booking-addons";
const groups = [{id:"essentials",title:"مستلزمات الإقامة",icon:Bath,hint:"كل ما يكمل راحتك"},{id:"hospitality",title:"الضيافة",icon:Coffee,hint:"ثلاث باقات لإقامتك"},{id:"fun",title:"الألعاب والسينما",icon:Gamepad2,hint:"وقت ممتع مع العائلة"},{id:"decor",title:"تنسيق المناسبة",icon:Flower2,hint:"لمسة خاصة لمناسبتك"},{id:"seating",title:"الجلسات الخارجية",icon:Armchair,hint:"اختر عدد الأشخاص ثم الجلسة المناسبة"},{id:"dining",title:"طاولات الطعام",icon:UtensilsCrossed,hint:"اختر العدد والتجهيز المناسب لك"}];
const n=(v:number)=>new Intl.NumberFormat("ar-SA-u-nu-latn").format(v);
export default function ResortAddons({selected,onChange,quantities,onQuantity}:{selected:string[];onChange:(v:string[])=>void;quantities:Record<string,number>;onQuantity:(id:string,n:number)=>void}){
 const included=BOOKING_ADDONS.filter(a=>selected.includes(a.id)).flatMap(a=>a.included??[]);
 function toggle(a:BookingAddon){
  if(included.includes(a.id))return;
  if(selected.includes(a.id)){onChange(selected.filter(id=>id!==a.id));return;}
  const next=selected.filter(id=>{const old=BOOKING_ADDONS.find(x=>x.id===id);return !(a.group==="hospitality"&&old?.group==="hospitality")&&!(a.variantGroup&&old?.variantGroup===a.variantGroup)&&!a.included?.includes(id)});
  onChange([...next,a.id]);onQuantity(a.id,1);
 }
 function row(a:BookingAddon){return <AddonItem key={a.id} addon={a} chosen={selected.includes(a.id)} covered={included.includes(a.id)} quantity={quantities[a.id]??1} onToggle={()=>toggle(a)} onQuantity={count=>onQuantity(a.id,count)}/>}
 return <Accordion type="multiple" className="resort-extras">{groups.map(g=>{const list=BOOKING_ADDONS.filter(a=>a.property==="resort"&&a.group===g.id), chosen=list.filter(a=>selected.includes(a.id));return <AccordionItem value={g.id} key={g.id}><AccordionTrigger className="extras-trigger"><span className="extras-heading"><g.icon size={23}/><span><strong>{g.title}</strong><small>{chosen.length?chosen.map(a=>a.title+((quantities[a.id]??1)>1?` × ${n(quantities[a.id])}`:"")).join(" · "):g.hint}</small></span></span></AccordionTrigger><AccordionContent>{g.id==="seating" ? <SeatingAddons selected={selected} onChange={onChange}/> : <>{g.id==="hospitality"&&<p className="extras-hint">اختيار باقة واحدة · يمكنك المتابعة دون ضيافة</p>}{list.filter(a=>!a.variantGroup).map(row)}{[...new Set(list.map(a=>a.variantGroup).filter(Boolean))].map(v=>{const options=list.filter(a=>a.variantGroup===v);const picked=options.find(a=>selected.includes(a.id));if(v==="dining")return <DiningAddon key={v} options={options} selectedId={picked?.id} onChoose={toggle}/>;if(v==="bbq")return <BarbecueAddon key={v} options={options} selectedId={picked?.id} onChoose={toggle}/>;return <VariantAddon key={v} options={options} selectedId={picked?.id} included={included} onChoose={toggle}/>;})}</>}</AccordionContent></AccordionItem>})}</Accordion>
}
