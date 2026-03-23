import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Navbar from "@/components/Navbar";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface FamilyLocation {
  name: string;
  description: string;
  surnames: string[];
  lat: number;
  lng: number;
}

const locations: FamilyLocation[] = [
  {
    name: "дер. Римаши, Беларусь",
    description: "Родина рода Тороцко. Отсюда происходит офицер РИА Николай Тороцко, награждённый Георгиевским оружием.",
    surnames: ["Тороцко"],
    lat: 54.15,
    lng: 26.85,
  },
  {
    name: "г. Воронеж",
    description: "Дворянское гнездо Черномашенцевых. Семья была связана с военной службой и землевладением.",
    surnames: ["Черномашенцевы"],
    lat: 51.6608,
    lng: 39.2003,
  },
  {
    name: "г. Одесса",
    description: "Центр бизнеса семьи Поляковых. Торговля и предпринимательство на юге Российской империи.",
    surnames: ["Поляковы"],
    lat: 46.4825,
    lng: 30.7233,
  },
  {
    name: "г. Омутнинск",
    description: "Родина рода Шуплецовых. Промышленный город на Вятской земле, связанный с металлургией.",
    surnames: ["Шуплецовы"],
    lat: 58.6711,
    lng: 52.1936,
  },
  {
    name: "г. Уржум",
    description: "Родина Березкиных. Старинный уездный город Вятской губернии с богатой историей.",
    surnames: ["Березкины"],
    lat: 57.1094,
    lng: 49.9972,
  },
];

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([53.5, 38.0], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng]).addTo(map);
      const badges = loc.surnames
        .map((s) => `<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:9999px;background:hsl(222,42%,30%);color:white;font-weight:500;">${s}</span>`)
        .join(" ");
      marker.bindPopup(
        `<div style="max-width:240px;font-family:Inter,sans-serif;">
          <p style="font-weight:600;font-size:14px;margin:0 0 4px;">${loc.name}</p>
          <p style="font-size:12px;color:#666;margin:0 0 8px;">${loc.description}</p>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">${badges}</div>
        </div>`
      );
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 py-4 border-b border-border"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">Карта рода</h1>
          <p className="text-sm text-muted-foreground">
            Места, где жили, служили и вели дела наши предки
          </p>
        </motion.div>

        <div className="flex-1 relative z-0">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
