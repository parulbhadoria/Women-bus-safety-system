import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MarkerType = { lat: number; lng: number; label: string; color?: string };
type Props = { center: [number, number]; zoom?: number; markers: MarkerType[]; height?: string };
const MapComponent: React.FC<Props> = ({ center, zoom = 15, markers, height = "60vh" }) => (
  <MapContainer key={`${center[0]}-${center[1]}`} center={center} zoom={zoom} style={{ height: "100%", width: "100%", minHeight: height, borderRadius: 16 }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    {markers.map((m, i) => (
      <Marker key={`${m.label}-${i}`} position={[m.lat, m.lng]}>
        <Popup>{m.label}</Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default MapComponent;
