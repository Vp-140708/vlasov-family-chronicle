import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Исправление бага с пропадающими иконками в React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor:[12, 41]
});

// Тестовые данные (позже мы подключим их из базы данных Supabase)
const familyLocations =[
  { 
    id: 1, 
    name: "Иван Власов (Прадед)", 
    event: "Рождение", 
    year: "1890",
    lat: 55.7558, 
    lng: 37.6173, 
    desc: "Родился в Московской губернии. Здесь началась наша история." 
  },
  { 
    id: 2, 
    name: "Анна Власова", 
    event: "Переезд", 
    year: "1932",
    lat: 59.9343, 
    lng: 30.3351, 
    desc: "Переехала в Ленинград для учебы в университете." 
  },
  { 
    id: 3, 
    name: "Михаил Власов", 
    event: "Место службы", 
    year: "1943",
    lat: 48.7071, 
    lng: 44.5169, 
    desc: "Участвовал в обороне Сталинграда. Награжден медалью." 
  }
];

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
          Карта путей предков
        </h1>
        <p className="text-stone-600 max-w-2xl">
          Здесь отмечены ключевые места жизни нашей семьи: где рождались, жили, воевали и работали наши предки. Нажмите на метку, чтобы узнать подробности.
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-200">
        <div className="rounded-xl overflow-hidden" style={{ height: '65vh', minHeight: '400px' }}>
          {/* center - это координаты центра карты при загрузке. Сейчас это центр европейской части */}
          <MapContainer 
            center={[54.0, 39.0]} 
            zoom={5} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            {/* Это сама картинка карты (Тайлы) от OpenStreetMap, она бесплатная */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Рисуем метки из нашего массива */}
            {familyLocations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
                <Popup className="font-sans">
                  <div className="p-1">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                      {loc.year} • {loc.event}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-stone-800 mb-1">
                      {loc.name}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2">
                      {loc.desc}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}