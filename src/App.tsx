import { AgricultureMap } from './components/AgricultureMap';
import { WMSLayerConfig } from './types/wms';

/**
 * Main application component
 * Demonstrates how to configure WMS layers with GeoServer styles
 */
function App() {
  // Example WMS layer configurations for agriculture
  const wmsLayers: WMSLayerConfig[] = [
    {
      url: 'http://localhost:8080/geoserver/agriculture/wms',
      layers: 'agriculture:parcelles_agricoles',
      styles: 'parcelles_style', // This is crucial - specify the style name from GeoServer
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      attribution: 'Agriculture Data - GeoServer'
    },
    {
      url: 'http://localhost:8080/geoserver/agriculture/wms',
      layers: 'agriculture:types_culture',
      styles: 'culture_style', // Another styled layer
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      attribution: 'Culture Types - GeoServer'
    }
    // Example with SLD for advanced styling:
    // {
    //   url: 'http://localhost:8080/geoserver/agriculture/wms',
    //   layers: 'agriculture:zones_irrigation',
    //   sld: 'http://localhost:8080/geoserver/styles/irrigation_zones.sld',
    //   format: 'image/png',
    //   transparent: true,
    //   version: '1.1.1',
    //   attribution: 'Irrigation Zones - GeoServer'
    // }
  ];

  return (
    <div className="App">
      <AgricultureMap 
        center={[46.603354, 1.888334]} // Center of France
        zoom={6}
        wmsLayers={wmsLayers}
      />
    </div>
  );
}

export default App;