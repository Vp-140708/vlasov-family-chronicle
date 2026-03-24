import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Исправление иконок
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const familyPoints = [
  { id: 1, name: "Иван Власов", event: "Рождение", pos: [55.7558, 37.6173] as [number, number], year: "1890" },
  { id: 2, name: "Николай Тороцко", event: "Служба", pos: [59.9343, 30.3351] as [number, number], year: "1915" },
];

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#fdf6e9] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Заголовок в твоем стиле */}
        <div className="text-center mb-10">
          <span className="text-[#b4945c] uppercase tracking-[0.4em] text-xs font-bold block mb-4">География рода</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800">Карта памяти</h1>
          <div className="w-24 h-1 bg-[#b4945c] mx-auto mt-6" />
        </div>

        {/* Контейнер для карты с золотой рамой */}
        <div className="relative p-3 md:p-6 bg-white border border-[#b4945c]/30 shadow-2xl rounded-sm">
          {/* Декоративные уголки */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#b4945c] -translate-x-2 -translate-y-2 z-20" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#b4945c] translate-x-2 translate-y-2 z-20" />

          <div className="relative h-[70vh] w-full overflow-hidden border border-stone-200">
            <MapContainer 
              center={[57.0, 35.0]} 
              zoom={5} 
              style={{ height: '100%', width: '100%', background: '#f4ede1' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // Накладываем фильтр сепии прямо на тайлы карты, чтобы она выглядела как старая бумага
                eventHandlers={{
                  add: (e) => {
                    e.target.getContainer().style.filter = 'sepia(80%) contrast(90%) brightness(95%) hue-rotate(-20deg)';
                  }
                }}
              />
              
              {familyPoints.map(point => (
                <Marker key={point.id} position={point.pos}>
                  <Popup>
                    <div className="font-serif p-1">
                      <span className="text-[#b4945c] font-bold text-xs">{point.year}</span>
                      <h3 className="text-lg font-bold text-stone-800">{point.name}</h3>
                      <p className="text-stone-600 text-sm">{point.event}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Легенда под картой */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/50 p-6 border-l-4 border-[#b4945c] rounded-r-xl">
            <h4 className="font-serif font-bold text-stone-800 uppercase text-xs tracking-widest mb-2">Инструкция</h4>
            <p className="font-serif text-sm text-stone-600 leading-relaxed">
              Используйте колесо мыши для масштабирования. Нажимайте на золотые маркеры, чтобы открыть историю места.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}