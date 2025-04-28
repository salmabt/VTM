///import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import des icônes
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correction des icônes manquantes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [48.8566, 2.3522]; // Paris comme position par défaut
const DEFAULT_ZOOM = 13;

const TechnicienMap = ({ 
  technician, 
  client, 
  technicianPosition, 
  clientPosition,
  showRoute = true
}) => {
 // Dans TechnicienMap.js, modifiez la fonction getValidPosition :
const getValidPosition = (pos, fallback) => {
    if (Array.isArray(pos) && pos.length === 2 && 
        !isNaN(pos[0]) && !isNaN(pos[1])) {
      return [pos[1], pos[0]]; // Inversion longitude/latitude si nécessaire
    }
    return fallback || [35.8254, 10.6369]; // Sousse comme fallback pour Tunisie
  };
  console.log('TechnicienMap props:', { 
    technician, 
    client, 
    technicianPosition, 
    clientPosition 
  });

  // Positions avec fallback
 // Modifiez la partie des positions dans TechnicienMap :
const techPos = getValidPosition(
    technician?.coordinates?.coordinates || technicianPosition,
    DEFAULT_CENTER
  );
  
  const cliPos = getValidPosition(
    client?.coordinates?.coordinates || clientPosition,
    techPos // Fallback sur la position du technicien
  );

  // Centre de la carte (milieu entre technicien et client ou position du technicien)
  const mapCenter = showRoute 
    ? [(techPos[0] + cliPos[0]) / 2, (techPos[1] + cliPos[1]) / 2]
    : techPos;

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={mapCenter} 
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <Marker position={techPos}>
          <Popup>
            <b>Technicien:</b> {technician.name}<br/>
            {technician.vehicle && (
              <>
                <b>Véhicule:</b> {technician.vehicle.model} ({technician.vehicle.registration})
              </>
            )}
          </Popup>
        </Marker>
        
        <Marker position={cliPos}>
          <Popup>
            <b>Client:</b> {client.name}<br/>
            <b>Adresse:</b> {client.address || client.location}
          </Popup>
        </Marker>
        
        {showRoute && (
          <Polyline 
            positions={[techPos, cliPos]} 
            color="blue"
            dashArray="5, 5"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TechnicienMap;