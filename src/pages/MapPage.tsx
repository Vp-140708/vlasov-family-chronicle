import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Базовый фикс иконок
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: shadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#fdf6e9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto border-4 border-[#b4945c] p-2 bg-white shadow-2xl">
        <div className="h-[70vh] w-full">
          <MapContainer center={[55.75, 37.61]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // Добавляем этот обработчик для стилизации
              eventHandlers={{
                add: (e) => {
                  const container = e.target.getContainer();
                  container.style.filter = 'sepia(60%) contrast(90%) brightness(105%) hue-rotate(-15deg)';
                },
              }}
            />
            <Marker position={[55.75, 37.61]}>
              <Popup>Москва - колыбель рода</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <div className="text-center mt-8 font-serif">
        <h2 className="text-[#b4945c] text-2xl uppercase tracking-widest">География предков</h2>
        <p className="text-stone-600 italic">Интерактивная карта перемещений семьи Власовых</p>
      </div>
    </div>
  );
}