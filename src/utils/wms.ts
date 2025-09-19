import { WMSLayerConfig } from '../types/wms';

/**
 * Constructs WMS URL with proper parameters for GeoServer
 * This function ensures that styles are properly included in the WMS request
 */
export function buildWMSUrl(config: WMSLayerConfig): string {
  const params = new URLSearchParams({
    service: 'WMS',
    version: config.version || '1.1.1',
    request: 'GetMap',
    layers: config.layers,
    format: config.format || 'image/png',
    transparent: (config.transparent !== false).toString(),
    width: '256',
    height: '256',
    srs: 'EPSG:3857',
    bbox: '{bbox-epsg-3857}' // This will be replaced by Leaflet
  });

  // Add styles parameter - this is crucial for GeoServer style support
  if (config.styles) {
    params.append('styles', config.styles);
  }

  // Add SLD support for custom styling
  if (config.sld) {
    params.append('sld', config.sld);
  }

  if (config.sld_body) {
    params.append('sld_body', config.sld_body);
  }

  // Add CQL filter for server-side filtering
  if (config.cql_filter) {
    params.append('cql_filter', config.cql_filter);
  }

  return `${config.url}?${params.toString()}`;
}

/**
 * Validates WMS layer configuration
 */
export function validateWMSConfig(config: WMSLayerConfig): boolean {
  if (!config.url || !config.layers) {
    console.error('WMS configuration missing required url or layers');
    return false;
  }

  // Warn if no styles are specified
  if (!config.styles && !config.sld && !config.sld_body) {
    console.warn('No styles specified for WMS layer. Styles may not be visible.');
  }

  return true;
}