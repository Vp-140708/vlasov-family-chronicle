import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Navbar from "@/components/Navbar";
import type { FamilyMember } from "@/data/familyData";
import { fetchAllRelatives } from "@/lib/familyMembers";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapLocation = {
  key: string;
  name: string;
  description?: string | null;
  surnames?: string[] | null;
  lat: number;
  lng: number;
  memberIds?: string[];
};

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const mercury = useMemo(() => {
    if (!members.length) return null;
    return members.find((m) => /меркурий/i.test(m.name)) ?? null;
  }, [members]);

  const locations: MapLocation[] = useMemo(() => {
    if (!members.length) return [];

    const out: MapLocation[] = [];
    const pushLoc = (loc: any, memberId?: string) => {
      const lat = typeof loc?.lat === "number" ? loc.lat : typeof loc?.map_lat === "number" ? loc.map_lat : null;
      const lng = typeof loc?.lng === "number" ? loc.lng : typeof loc?.map_lng === "number" ? loc.map_lng : null;
      const name = (loc?.name ?? loc?.map_city ?? "").toString().trim();
      if (!name || lat == null || lng == null) return;

      const description = loc?.description ?? loc?.map_description ?? null;
      const surnames = loc?.surnames ?? loc?.map_surnames ?? null;
      const key = `${name}|${lat.toFixed(4)}|${lng.toFixed(4)}`;

      const existing = out.find((x) => x.key === key);
      if (existing) {
        if (memberId) existing.memberIds = Array.from(new Set([...(existing.memberIds ?? []), memberId]));
        return;
      }

      out.push({
        key,
        name,
        description,
        surnames,
        lat,
        lng,
        memberIds: memberId ? [memberId] : [],
      });
    };

    for (const m of members) {
      // 1) If you store locations as an array JSON field
      if (Array.isArray(m.map_locations)) {
        for (const loc of m.map_locations) pushLoc(loc, m.id);
      }
      // 2) If you store a single place on the member record
      if (m.map_city && typeof m.map_lat === "number" && typeof m.map_lng === "number") {
        pushLoc(
          {
            name: m.map_city,
            description: m.map_description ?? null,
            lat: m.map_lat,
            lng: m.map_lng,
            surnames: m.map_surnames ?? null,
          },
          m.id
        );
      }
    }

    return out;
  }, [members]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await fetchAllRelatives();
        const normalized: FamilyMember[] = rows.map((r) => ({
          id: r.id,
          name: r.name,
          years: r.years ?? "",
          title: r.title ?? "",
          branch: (r.branch as any) ?? "both",
          bio: r.bio ?? "",
          habits: r.habits ?? [],
          medical: r.medical ?? [],
          generation: r.generation ?? 0,
          mother_id: r.mother_id ?? null,
          father_id: r.father_id ?? null,
          spouse_id: r.spouse_id ?? null,
          gender: r.gender ?? null,
          map_locations: r.map_locations ?? null,
          map_city: r.map_city ?? null,
          map_lat: r.map_lat ?? null,
          map_lng: r.map_lng ?? null,
          map_description: r.map_description ?? null,
          map_surnames: r.map_surnames ?? null,
          photo_url: r.photo_url ?? null,
        }));
        if (!mounted) return;
        setMembers(normalized);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[MapPage] Failed to load family_members:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!locations.length) return;

    // Re-create the map to ensure clean removal of markers/polylines.
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView([53.5, 38.0], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    for (const loc of locations) {
      const marker = L.marker([loc.lat, loc.lng]).addTo(map);
      bounds.extend([loc.lat, loc.lng]);

      marker.on("click", () => {
        setSelectedLocation(loc);
      });
    }

    // Migration polyline: Minsk -> Stavropol -> Dzhubga
    const getByCity = (re: RegExp) => locations.find((l) => re.test(l.name));
    const minsk = getByCity(/минск/i);
    const stavropol = getByCity(/ставроп/i);
    const dzhubga = getByCity(/джубг/i);
    if (minsk && stavropol && dzhubga) {
      const coords: L.LatLngExpression[] = [
        [minsk.lat, minsk.lng],
        [stavropol.lat, stavropol.lng],
        [dzhubga.lat, dzhubga.lng],
      ];
      L.polyline(coords, { color: "hsl(43, 76%, 52%)", weight: 3, opacity: 0.9 }).addTo(map);
    }

    // Fit view after adding all markers
    try {
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.25));
    } catch {
      // ignore
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations]);

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

        {/* Card that slides in on marker click */}
        <motion.div
          initial={false}
          animate={{ x: selectedLocation ? 0 : "100%" }}
          transition={{ type: "tween", duration: 0.35 }}
          className="fixed top-20 right-4 z-[60] w-[320px] max-w-[calc(100vw-2rem)]"
        >
          {selectedLocation && (
            <div className="card-heritage p-5 border-border bg-background shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Точка на карте</p>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                    {selectedLocation.name}
                  </h3>
                </div>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setSelectedLocation(null)}
                  aria-label="Закрыть"
                >
                  ✕
                </button>
              </div>

              {/* Requested behavior: Sevastopol -> Mercury Vlasov card */}
              {/севастопол/i.test(selectedLocation.name) && mercury ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
                    Меркурий Власов
                  </p>
                  <div className="mt-2 text-sm text-foreground font-medium">
                    Здесь он героически сражался в 1942 году
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  {selectedLocation.description ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedLocation.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Нет подробного описания в архиве.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {loading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[40]">
            <div className="text-muted-foreground">Загрузка карты...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
