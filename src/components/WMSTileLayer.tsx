import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { WMSLayerConfig } from '../types/wms';
import { validateWMSConfig } from '../utils/wms';

interface WMSTileLayerProps {
  config: WMSLayerConfig;
  opacity?: number;
  zIndex?: number;
}

/**
 * WMS Tile Layer component that properly handles GeoServer styles
 * This component ensures that styles parameter is correctly passed to GeoServer
 */
export function WMSTileLayer({ config, opacity = 1, zIndex = 1 }: WMSTileLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer.WMS | null>(null);

  useEffect(() => {
    if (!validateWMSConfig(config)) {
      return;
    }

    // Create WMS layer with proper parameters
    const wmsOptions: L.WMSOptions = {
      layers: config.layers,
      format: config.format || 'image/png',
      transparent: config.transparent !== false,
      version: config.version || '1.1.1',
      opacity,
      attribution: config.attribution || '',
    };

    // Critical: Add styles parameter to ensure GeoServer styles are applied
    if (config.styles) {
      (wmsOptions as any).styles = config.styles;
      console.log(`WMS Layer styles parameter set to: ${config.styles}`);
    }

    // Add SLD support for advanced styling
    if (config.sld) {
      (wmsOptions as any).sld = config.sld;
      console.log(`WMS Layer SLD parameter set to: ${config.sld}`);
    }

    if (config.sld_body) {
      (wmsOptions as any).sld_body = config.sld_body;
    }

    // Add CQL filter support
    if (config.cql_filter) {
      (wmsOptions as any).cql_filter = config.cql_filter;
    }

    // Create the WMS layer
    const wmsLayer = L.tileLayer.wms(config.url, wmsOptions);

    // Set z-index for layer ordering
    if (zIndex) {
      wmsLayer.options.zIndex = zIndex;
    }

    // Add layer to map
    wmsLayer.addTo(map);
    layerRef.current = wmsLayer;

    // Log layer creation for debugging
    console.log('WMS Layer created with config:', {
      url: config.url,
      layers: config.layers,
      styles: config.styles,
      format: config.format,
      version: config.version
    });

    // Cleanup function
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, config, opacity, zIndex]);

  // Update opacity if it changes
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  return null; // This component doesn't render anything directly
}