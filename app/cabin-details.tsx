"use client";

import { Armchair, Check, ChefHat, Clock3, Flower2, Home, Info, MapPin, ShieldCheck, Sparkles, UtensilsCrossed, ChevronLeft, Waves } from "lucide-react";
import type { ReactNode } from "react";
import cabinData from "./cabins.json";
import { getProperty } from "./property-catalog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

type Cabin = typeof cabinData[number];
const n = (value: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(value);
const guests = (value: number) => value === 2 ? "حتى ضيفين" : `حتى ${n(value)} ${value <= 10 ? "ضيوف" : "ضيفا"}`;

function FeatureList({items, isolateMeasurements = false}: {items: string[]; isolateMeasurements?: boolean}) {
 return <ul className="detail-feature-list">{items.map(item => <li key={item}><Check size={17}/><span>{isolateMeasurements ? item.split(/(\d+ × \d+)/).map((part, index) => /\d+ × \d+/.test(part) ? <bdi key={index} dir="ltr">{part}</bdi> : part) : item}</span></li>)}</ul>;
}

export default function CabinDetails({cabin, onPolicy, priceSummary, checkoutLabel = "12 ظهرًا"}: {cabin: Cabin; onPolicy: () => void; priceSummary?: ReactNode; checkoutLabel?: string}) {
 const isResort = cabin.property === "resort";
 const outdoorItems = isResort
  ? [...cabin.outdoor, cabin.pool, ...cabin.poolNotes, ...cabin.poolFacilities]
  : [...cabin.outdoor, [cabin.pool, ...cabin.poolNotes.map(note => note.replace("عمق المسبح يصل إلى", "بعمق"))].join(" · "), ...cabin.poolFacilities];
 return <div className="detail-body cabin-complete-details">
  <div className="cabin-title"><span className="eyebrow"><MapPin size={14}/>{getProperty(cabin.property)?.name}</span><h1>{cabin.name}</h1><p>{cabin.suitable} – {guests(cabin.capacity)}</p></div>
  {getProperty(cabin.property)?.kind !== "resthouse" && <p className="description">{cabin.description}</p>}
  {priceSummary}

  <Accordion type="multiple" className="detail-accordion">
  <AccordionItem value="indoor"><AccordionTrigger><span><Home size={21}/>{isResort ? "داخل الكوخ" : "المنطقة الداخلية"}</span></AccordionTrigger><AccordionContent><FeatureList items={cabin.indoor}/></AccordionContent></AccordionItem>
  <AccordionItem value="outdoor"><AccordionTrigger><span><Armchair size={21}/>المنطقة الخارجية والمسبح</span></AccordionTrigger><AccordionContent><FeatureList items={outdoorItems} isolateMeasurements={isResort}/>
   {cabin.outdoorNotes.map(note => <p className="detail-note" key={note}><ShieldCheck size={17}/>{note}</p>)}
  </AccordionContent></AccordionItem>
  <AccordionItem value="kitchen"><AccordionTrigger><span><ChefHat size={21}/>تجهيزات المطبخ</span></AccordionTrigger><AccordionContent><FeatureList items={cabin.kitchen}/>{cabin.minibar && <p className="detail-note"><Info size={17}/>الميني بار: وجبات خفيفة ومشروبات متنوعة برسوم إضافية</p>}</AccordionContent></AccordionItem>
  <AccordionItem value="features"><AccordionTrigger><span><Sparkles size={21}/>مميزات الإقامة</span></AccordionTrigger><AccordionContent><FeatureList items={cabin.stayFeatures}/>{cabin.sharedGarden && <div className="garden-detail"><Flower2 size={22}/><div><strong>الحديقة المشتركة</strong><p>{cabin.sharedGarden}</p><p>ألعاب أطفال متنوعة وشاشة عرض مشتركة</p></div></div>}</AccordionContent></AccordionItem>
  <AccordionItem value="services"><AccordionTrigger><span><UtensilsCrossed size={21}/>الخدمات المتاحة</span></AccordionTrigger><AccordionContent><div className="available-service-list">{cabin.availableServices.map(service => <div key={service.title}><strong>{service.title}</strong><p>{service.detail}</p></div>)}</div></AccordionContent></AccordionItem>
  <AccordionItem value="information"><AccordionTrigger><span><Clock3 size={21}/>{isResort ? "معلومات الإقامة" : "معلومات الإقامة والسياسات"}</span></AccordionTrigger><AccordionContent><div className="stay-times"><span>الدخول<strong>4 مساء</strong></span><span>الخروج<strong>{checkoutLabel}</strong></span></div>{isResort ? <p className="detail-note"><Waves size={17}/>مسابح الكبار غير مخصصة للأطفال</p> : <button className="policy-row" onClick={onPolicy}>السياسات ومعلومات الإقامة <ChevronLeft size={18}/></button>}</AccordionContent></AccordionItem>
  </Accordion>
 </div>;
}
