import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet';
import LayerControl from './components/LayerControl';
import GeoServerInfo from './components/GeoServerInfo';
import GEOSERVER_CONFIG from './config/geoserver';
import 'leaflet/dist/leaflet.css';

function App() {
  const [layerVisibility, setLayerVisibility] = useState(
    GEOSERVER_CONFIG.defaultLayers.reduce((acc, layer) => {
      acc[layer.id] = layer.visible;
      return acc;
    }, {})
  );
  
  const [layerErrors, setLayerErrors] = useState({});
  const [layerLoading, setLayerLoading] = useState({});

  // Fonction pour vérifier la disponibilité du GeoServer
  const checkGeoServerConnection = async () => {
    try {
      const response = await fetch(`${GEOSERVER_CONFIG.server.baseUrl}/web/`);
      return response.ok;
    } catch (error) {
      console.error('Erreur de connexion GeoServer:', error);
      return false;
    }
  };

  // Fonction pour construire l'URL WMS correcte (pour référence future)
  // eslint-disable-next-line no-unused-vars
  const buildWMSUrl = (layer) => {
    const params = new URLSearchParams({
      service: 'WMS',
      version: GEOSERVER_CONFIG.wmsParams.version,
      request: 'GetMap',
      layers: layer.name,
      styles: layer.style || '', // Utilise le style défini ou style par défaut
      bbox: '{bbox-epsg-3857}',
      width: 256,
      height: 256,
      srs: 'EPSG:3857',
      format: GEOSERVER_CONFIG.wmsParams.format,
      transparent: GEOSERVER_CONFIG.wmsParams.transparent
    });
    
    return `${GEOSERVER_CONFIG.server.baseUrl}/${GEOSERVER_CONFIG.server.workspace}/wms?${params.toString()}`;
  };

  // Gestion de la visibilité des couches
  const toggleLayerVisibility = (layerId) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  // Gestion des erreurs de chargement des couches
  const handleLayerError = (layerId, error) => {
    console.error(`Erreur pour la couche ${layerId}:`, error);
    setLayerErrors(prev => ({
      ...prev,
      [layerId]: error.message || 'Erreur de chargement de la couche'
    }));
    setLayerLoading(prev => ({
      ...prev,
      [layerId]: false
    }));
  };

  // Gestion du début de chargement des couches
  const handleLayerLoading = (layerId) => {
    setLayerLoading(prev => ({
      ...prev,
      [layerId]: true
    }));
    setLayerErrors(prev => ({
      ...prev,
      [layerId]: null
    }));
  };

  // Gestion de la fin de chargement des couches
  const handleLayerLoad = (layerId) => {
    setLayerLoading(prev => ({
      ...prev,
      [layerId]: false
    }));
  };

  useEffect(() => {
    checkGeoServerConnection().then(isConnected => {
      if (!isConnected) {
        console.warn('GeoServer non accessible à l\'adresse:', GEOSERVER_CONFIG.server.baseUrl);
      }
    });
  }, []);

  return (
    <div className="App">
      <MapContainer
        center={GEOSERVER_CONFIG.mapSettings.center}
        zoom={GEOSERVER_CONFIG.mapSettings.zoom}
        minZoom={GEOSERVER_CONFIG.mapSettings.minZoom}
        maxZoom={GEOSERVER_CONFIG.mapSettings.maxZoom}
        maxBounds={GEOSERVER_CONFIG.mapSettings.maxBounds}
        style={{ height: '100vh', width: '100%' }}
      >
        {/* Fond de carte OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Couches GeoServer */}
        {GEOSERVER_CONFIG.defaultLayers.map(layer => (
          layerVisibility[layer.id] && (
            <WMSTileLayer
              key={layer.id}
              url={`${GEOSERVER_CONFIG.server.baseUrl}/${GEOSERVER_CONFIG.server.workspace}/wms`}
              layers={layer.name}
              format={GEOSERVER_CONFIG.wmsParams.format}
              transparent={GEOSERVER_CONFIG.wmsParams.transparent}
              styles={layer.style || ''}
              opacity={layer.opacity}
              attribution={layer.attribution || `Couche: ${layer.title}`}
              eventHandlers={{
                loading: () => handleLayerLoading(layer.id),
                load: () => handleLayerLoad(layer.id),
                tileerror: (error) => handleLayerError(layer.id, error)
              }}
            />
          )
        ))}
      </MapContainer>

      {/* Contrôle des couches */}
      <LayerControl
        layers={GEOSERVER_CONFIG.defaultLayers}
        layerVisibility={layerVisibility}
        onToggleLayer={toggleLayerVisibility}
        layerErrors={layerErrors}
        layerLoading={layerLoading}
      />

      {/* Informations GeoServer */}
      <GeoServerInfo config={GEOSERVER_CONFIG} />
    </div>
  );
}

export default App;