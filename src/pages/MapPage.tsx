import { useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";

// Fix default marker icons in bundled builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 h-screen flex flex-col">
        {/* Header */}
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

        {/* Map */}
        <div className="flex-1 relative z-0">
          <MapContainer
            center={[53.5, 38.0]}
            zoom={5}
            className="w-full h-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
              <Marker key={loc.name} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div className="font-body max-w-[240px]">
                    <p className="font-display font-semibold text-sm mb-1">{loc.name}</p>
                    <p className="text-xs text-gray-600 mb-2">{loc.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {loc.surnames.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
