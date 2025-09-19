export interface WMSLayerConfig {
  url: string;
  layers: string;
  format?: string;
  transparent?: boolean;
  version?: string;
  styles?: string; // This is crucial for GeoServer styles
  sld?: string; // For Styled Layer Descriptor
  sld_body?: string; // For inline SLD
  cql_filter?: string; // For server-side filtering
  attribution?: string;
}

export interface GeoServerConfig {
  baseUrl: string;
  workspace?: string;
  username?: string;
  password?: string;
}