import React, { useState, useEffect } from "react";
import { MapPin, Search, Navigation, X } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ContactOffice = () => {
  const officeLocation = {
    latitude: 28.6139,
    longitude: 77.2090,
    address: "Delhi, India",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mapCenter, setMapCenter] = useState([officeLocation.latitude, officeLocation.longitude]);
  const [mapZoom, setMapZoom] = useState(14);
  const [routeMode, setRouteMode] = useState(false);
  const [routeStart, setRouteStart] = useState(null);
  const [route, setRoute] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
        {
          headers: {
            "User-Agent": "DigitalVoyager/1.0",
          },
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleLocationSelect = (location) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    setMapCenter([lat, lon]);
    setMapZoom(15);
    setSearchQuery(location.display_name);
    setSearchResults([]);
    setShowSearch(false);

    if (routeMode && !routeStart) {
      setRouteStart([lat, lon]);
    } else if (routeMode && routeStart) {
      calculateRoute(routeStart, [lat, lon]);
    }
  };

  const calculateRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const geometry = data.routes[0].geometry;
        const coordinates = geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute({ coordinates });
        const latLngs = coordinates.map(coord => L.latLng(coord[0], coord[1]));
        const bounds = L.latLngBounds(latLngs);
        setMapCenter(bounds.getCenter());
        setMapZoom(13);
      }
    } catch (error) {
      console.error("Route calculation error:", error);
      alert("Route calculation failed. Please try again.");
    }
  };

  const handleOpenInOSM = () => {
    const mapUrl = `https://www.openstreetmap.org/?mlat=${officeLocation.latitude}&mlon=${officeLocation.longitude}&zoom=14`;
    window.open(mapUrl, "_blank");
  };

  return (
    <section className="bg-[#0d1325] text-white py-16 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4 text-center"
      >
        Visit Our Office
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center"
      >
        <MapPin className="w-12 h-12 mx-auto text-sky-400 mb-4" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl font-semibold mb-2 text-center"
      >
        Digital Voyager Headquarters
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-300 mb-2 text-center"
      >
        {officeLocation.address}
      </motion.p>
      
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="block mt-2 text-gray-400 text-sm mb-6 text-center"
      >
        Our state-of-the-art facility houses advanced forensic labs and secure evidence storage.
      </motion.span>

      {/* Interactive OpenStreetMap with Leaflet */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mx-auto rounded-2xl overflow-hidden shadow-lg w-11/12 md:w-3/4 h-96 relative"
      >
        <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearch(true)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 rounded-lg bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(result)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-0"
                  >
                    <p className="text-gray-800 text-sm font-medium">{result.display_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setRouteMode(!routeMode);
              setRouteStart(null);
              setRoute(null);
            }}
            className={`px-4 py-2 rounded-lg transition ${
              routeMode
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <Marker position={[officeLocation.latitude, officeLocation.longitude]}>
            <Popup>
              <div className="text-gray-800">
                <strong>Digital Voyager</strong>
                <br />
                {officeLocation.address}
              </div>
            </Popup>
          </Marker>

          {routeStart && (
            <Marker position={routeStart}>
              <Popup>Route Start</Popup>
            </Marker>
          )}

          {route && route.coordinates && (
            <Polyline
              positions={route.coordinates}
              pathOptions={{
                color: "#3b82f6",
                weight: 4,
                opacity: 0.8,
              }}
            />
          )}
        </MapContainer>

        {routeMode && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm z-[1000]">
            {!routeStart ? (
              <p>📍 Click "Search" and select a location to set route start point</p>
            ) : !route ? (
              <p>📍 Search and select destination to calculate route</p>
            ) : (
              <div className="flex justify-between items-center">
                <p>✅ Route calculated!</p>
                <button
                  onClick={() => {
                    setRoute(null);
                    setRouteStart(null);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 text-center space-y-4"
      >
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            onClick={handleOpenInOSM}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Open in OpenStreetMap
          </motion.button>
        </div>
        <p className="text-gray-400 text-sm">
          Features: Location Search (Nominatim) • Route Calculation (OSRM) • 100% Free
        </p>
      </motion.div>
    </section>
  );
};

export default ContactOffice;
