// Configuration détaillée pour l'intégration GeoServer

export const GEOSERVER_CONFIG = {
  // Configuration du serveur GeoServer
  server: {
    // URL de base de votre GeoServer (à adapter selon votre installation)
    baseUrl: 'http://localhost:8080/geoserver',
    
    // Si votre GeoServer est sur un autre serveur:
    // baseUrl: 'https://votre-serveur.com/geoserver',
    
    // Workspace principal pour vos données agriculture
    workspace: 'agriculture',
    
    // Paramètres de connexion si nécessaire
    username: null, // Laissez null si accès public
    password: null  // Laissez null si accès public
  },

  // Configuration des couches par défaut
  defaultLayers: [
    {
      id: 'parcelles',
      name: 'agriculture:parcelles_agricoles',
      title: 'Parcelles Agricoles',
      description: 'Délimitation des parcelles agricoles',
      style: 'parcelles_style', // Style défini dans GeoServer
      opacity: 0.7,
      visible: true,
      minZoom: 8,
      maxZoom: 18,
      attribution: 'Données agricoles - Ministère Agriculture'
    },
    {
      id: 'cultures',
      name: 'agriculture:types_cultures',
      title: 'Types de Cultures',
      description: 'Classification des types de cultures par parcelle',
      style: 'cultures_chloropleth', // Style avec couleurs selon type
      opacity: 0.8,
      visible: false,
      minZoom: 10,
      maxZoom: 18,
      attribution: 'Classification cultures'
    },
    {
      id: 'irrigation',
      name: 'agriculture:systemes_irrigation',
      title: 'Systèmes d\'Irrigation',
      description: 'Réseaux et systèmes d\'irrigation',
      style: 'irrigation_lines', // Style pour lignes/réseaux
      opacity: 0.6,
      visible: false,
      minZoom: 12,
      maxZoom: 18,
      attribution: 'Réseaux irrigation'
    },
    {
      id: 'sols',
      name: 'agriculture:types_sols',
      title: 'Types de Sols',
      description: 'Classification pédologique des sols',
      style: 'sols_gradient', // Style avec dégradé selon type de sol
      opacity: 0.5,
      visible: false,
      minZoom: 8,
      maxZoom: 16,
      attribution: 'Données pédologiques'
    },
    {
      id: 'meteo_stations',
      name: 'agriculture:stations_meteorologiques',
      title: 'Stations Météorologiques',
      description: 'Emplacements des stations météo',
      style: 'meteo_points', // Style pour points
      opacity: 1.0,
      visible: false,
      minZoom: 6,
      maxZoom: 18,
      attribution: 'Météo France'
    }
  ],

  // Paramètres WMS par défaut
  wmsParams: {
    version: '1.1.0',
    format: 'image/png',
    transparent: true,
    tiled: true,
    tilesorigin: '-20037508.34,-20037508.34',
    // Paramètres pour améliorer la performance
    buffer: 0,
    // Paramètres pour les styles
    env: null // Peut être utilisé pour passer des variables aux styles SLD
  },

  // Configuration des fonds de carte
  baseLayers: [
    {
      id: 'osm',
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      default: true
    },
    {
      id: 'satellite',
      name: 'Vue Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
      default: false
    },
    {
      id: 'ign-plan',
      name: 'Plan IGN',
      url: 'https://wxs.ign.fr/{apikey}/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
      attribution: '© IGN',
      default: false,
      requiresApiKey: true
    }
  ],

  // Configuration de la carte
  mapSettings: {
    center: [46.603354, 1.888334], // Centre de la France
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    maxBounds: [
      [41.0, -5.0],  // Sud-Ouest
      [51.0, 10.0]   // Nord-Est
    ]
  },

  // Options pour le débogage
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logRequests: true,
    showLayerInfo: true,
    showPerformance: false
  }
};

// Fonctions utilitaires pour la configuration

export const buildWMSUrl = (layer, geoServerConfig = GEOSERVER_CONFIG) => {
  const baseUrl = `${geoServerConfig.server.baseUrl}/${geoServerConfig.server.workspace}/wms`;
  
  const params = new URLSearchParams({
    service: 'WMS',
    version: geoServerConfig.wmsParams.version,
    request: 'GetMap',
    layers: layer.name,
    styles: layer.style || '',
    bbox: '{bbox-epsg-3857}',
    width: 256,
    height: 256,
    srs: 'EPSG:3857',
    format: geoServerConfig.wmsParams.format,
    transparent: geoServerConfig.wmsParams.transparent,
    ...(geoServerConfig.wmsParams.tiled && { tiled: geoServerConfig.wmsParams.tiled }),
    ...(geoServerConfig.wmsParams.tilesorigin && { tilesorigin: geoServerConfig.wmsParams.tilesorigin })
  });
  
  return `${baseUrl}?${params.toString()}`;
};

export const getCapabilitiesUrl = (geoServerConfig = GEOSERVER_CONFIG) => {
  return `${geoServerConfig.server.baseUrl}/${geoServerConfig.server.workspace}/wms?service=WMS&version=1.1.0&request=GetCapabilities`;
};

export const getLayerInfoUrl = (layerName, geoServerConfig = GEOSERVER_CONFIG) => {
  return `${geoServerConfig.server.baseUrl}/rest/layers/${layerName}.json`;
};

export const validateGeoServerConfig = (config) => {
  const errors = [];
  
  if (!config.server.baseUrl) {
    errors.push('URL de base GeoServer manquante');
  }
  
  if (!config.server.workspace) {
    errors.push('Workspace GeoServer manquant');
  }
  
  if (!config.defaultLayers || config.defaultLayers.length === 0) {
    errors.push('Aucune couche configurée');
  }
  
  config.defaultLayers.forEach((layer, index) => {
    if (!layer.name) {
      errors.push(`Couche ${index}: nom manquant`);
    }
    if (!layer.title) {
      errors.push(`Couche ${index}: titre manquant`);
    }
  });
  
  return errors;
};

export default GEOSERVER_CONFIG;