import { MapContainer, TileLayer } from 'react-leaflet';
import { WMSTileLayer } from './WMSTileLayer';
import { WMSLayerConfig } from '../types/wms';

interface AgricultureMapProps {
  center?: [number, number];
  zoom?: number;
  wmsLayers?: WMSLayerConfig[];
}

/**
 * Main map component for agriculture application
 * Demonstrates proper WMS layer integration with GeoServer styles
 */
export function AgricultureMap({ 
  center = [46.603354, 1.888334], // Center of France
  zoom = 6,
  wmsLayers = []
}: AgricultureMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100vh', width: '100vw' }}
      zoomControl={true}
    >
      {/* Base layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* WMS Layers with styles */}
      {wmsLayers.map((layerConfig, index) => (
        <WMSTileLayer
          key={`wms-layer-${index}`}
          config={layerConfig}
          zIndex={100 + index}
          opacity={0.7}
        />
      ))}
    </MapContainer>
  );
}