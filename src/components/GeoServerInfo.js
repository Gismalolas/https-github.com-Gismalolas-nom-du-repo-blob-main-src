import React, { useState, useEffect } from 'react';

const GeoServerInfo = ({ config }) => {
  const [geoServerStatus, setGeoServerStatus] = useState('checking');
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    checkGeoServerStatus();
    // eslint-disable-next-line
  }, []);

  const checkGeoServerStatus = async () => {
    try {
      // Test de connexion basique
      // eslint-disable-next-line no-unused-vars
      const response = await fetch(`${config.server.baseUrl}/web/`, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      setGeoServerStatus('connected');
      
      // Tentative de récupération des capabilities WMS
      try {
        const capabilitiesUrl = `${config.server.baseUrl}/${config.server.workspace}/wms?service=WMS&version=1.1.0&request=GetCapabilities`;
        const capResponse = await fetch(capabilitiesUrl);
        
        if (capResponse.ok) {
          const text = await capResponse.text();
          setCapabilities(text);
        }
      } catch (capError) {
        console.log('Capabilities non accessibles:', capError);
      }
      
    } catch (error) {
      console.error('Erreur de connexion GeoServer:', error);
      setGeoServerStatus('disconnected');
    }
  };

  const getWMSExampleUrl = (layer) => {
    const params = new URLSearchParams({
      service: 'WMS',
      version: '1.1.0',
      request: 'GetMap',
      layers: layer.name,
      styles: layer.style || '',
      bbox: '1.888334,46.603354,2.888334,47.603354', // Exemple de bbox autour du centre de la France
      width: '512',
      height: '512',
      srs: 'EPSG:4326',
      format: 'image/png',
      transparent: 'true'
    });
    
    return `${config.server.baseUrl}/${config.server.workspace}/wms?${params.toString()}`;
  };

  const StatusIndicator = ({ status }) => {
    switch (status) {
      case 'connected':
        return <span style={{ color: 'green' }}>✅ Connecté</span>;
      case 'disconnected':
        return <span style={{ color: 'red' }}>❌ Déconnecté</span>;
      default:
        return <span style={{ color: 'orange' }}>🔄 Vérification...</span>;
    }
  };

  return (
    <div className="geoserver-info">
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        📡 Statut GeoServer
      </div>
      
      <div>
        <strong>Serveur:</strong> <StatusIndicator status={geoServerStatus} />
        <br />
        <small>{config.server.baseUrl}</small>
      </div>
      
      <div style={{ marginTop: '8px' }}>
        <strong>Workspace:</strong> {config.server.workspace}
        <br />
        <strong>Couches configurées:</strong> {config.defaultLayers.length}
      </div>

      {geoServerStatus === 'disconnected' && (
        <div style={{ 
          marginTop: '8px', 
          padding: '6px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px',
          fontSize: '10px'
        }}>
          <strong>⚠️ Problèmes possibles:</strong>
          <br />• GeoServer non démarré
          <br />• URL incorrecte
          <br />• Problèmes CORS
          <br />• Pare-feu bloquant la connexion
        </div>
      )}

      <details style={{ marginTop: '8px', fontSize: '10px' }}>
        <summary style={{ cursor: 'pointer' }}>🔧 URLs de test</summary>
        <div style={{ marginTop: '4px' }}>
          <div><strong>Capabilities WMS:</strong></div>
          <div style={{ 
            wordBreak: 'break-all', 
            backgroundColor: '#f5f5f5', 
            padding: '2px 4px',
            margin: '2px 0'
          }}>
            {config.server.baseUrl}/{config.server.workspace}/wms?service=WMS&version=1.1.0&request=GetCapabilities
          </div>
          
          {config.defaultLayers.length > 0 && (
            <>
              <div style={{ marginTop: '6px' }}><strong>Exemple GetMap pour "{config.defaultLayers[0].title}":</strong></div>
              <div style={{ 
                wordBreak: 'break-all', 
                backgroundColor: '#f5f5f5', 
                padding: '2px 4px',
                margin: '2px 0'
              }}>
                {getWMSExampleUrl(config.defaultLayers[0])}
              </div>
            </>
          )}
        </div>
      </details>

      {capabilities && (
        <details style={{ marginTop: '8px', fontSize: '10px' }}>
          <summary style={{ cursor: 'pointer' }}>📋 Capabilities (extrait)</summary>
          <div style={{ 
            maxHeight: '100px', 
            overflow: 'auto', 
            backgroundColor: '#f5f5f5', 
            padding: '4px',
            marginTop: '4px'
          }}>
            {capabilities.substring(0, 500)}...
          </div>
        </details>
      )}
    </div>
  );
};

export default GeoServerInfo;