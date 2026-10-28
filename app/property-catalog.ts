export type Property = {
  id: string;
  kind: "resort" | "resthouse" | "chalet";
  name: string;
  shortName: string;
  typeLabel: string;
  description: string;
  location: string;
  branch: string;
  disabled?: boolean;
  image: string;
  browseLabel: string;
  unitsLabel: string;
  chooseLabel: string;
  roomFilters: boolean;
  mapUrl: string;
  comingSoon?: boolean;
};

// Each physical location is a record, independent of navigation or property type.
// To add a chalet: add its verified details here, then accommodation records in
// cabins.json with the same property id. Every destination has its own booking home.
export const PROPERTIES: Property[] = [
  {
    id: "resort", kind: "resort", name: "منتجع يوم العائلة", shortName: "المنتجع", typeLabel: "منتجع",
    description: "أكواخ بمسابح خاصة للأزواج والعائلات",
    branch: "فرع خليج سلمان", location: "جدة · خليج سلمان", image: "/assets/dome_1.webp",
    browseLabel: "استعرض الأكواخ", unitsLabel: "الأكواخ", chooseLabel: "اختر الكوخ المناسب لك",
    roomFilters: true, mapUrl: "https://maps.app.goo.gl/FLmawLadNaa3uYpJ8?g_st=ic",
  },
  {
    id: "resort-obhur", kind: "resort", name: "منتجع يوم العائلة · أبحر", shortName: "المنتجع", typeLabel: "منتجع",
    description: "قريبا الافتتاح", branch: "فرع أبحر", location: "جدة · أبحر", image: "",
    browseLabel: "استعرض الأكواخ", unitsLabel: "الأكواخ", chooseLabel: "اختر الكوخ المناسب لك",
    roomFilters: true, mapUrl: "", comingSoon: true, disabled: true,
  },
  {
    id: "stay", kind: "resthouse", name: "استراحة يوم العائلة", shortName: "الاستراحة", typeLabel: "استراحة",
    description: "للعائلات والتجمعات · حتى 70 ضيف لكل قسم",
    branch: "فرع خليج سلمان", location: "جدة · خليج سلمان", image: "/assets/sec1_1.webp",
    browseLabel: "استعرض الأقسام", unitsLabel: "أقسام الاستراحة", chooseLabel: "اختر القسم المناسب لك",
    roomFilters: false, mapUrl: "https://maps.app.goo.gl/i7BhZbfkRLyV68eFA?g_st=ic",
  },
  {
    id: "chalet", kind: "chalet", name: "شاليه يوم العائلة", shortName: "الشاليه", typeLabel: "شاليه",
    description: "وجهة جديدة تنضم إلى يوم العائلة",
    branch: "فرع المروج", location: "جدة · المروج", image: "", browseLabel: "اكتشف الوجهة", unitsLabel: "الشاليه",
    chooseLabel: "احجز إقامتك", roomFilters: false, mapUrl: "",
  },
];

export const getProperty = (id: string) => PROPERTIES.find(place => place.id === id);
