import React from 'react';

const LayerControl = ({ 
  layers, 
  layerVisibility, 
  onToggleLayer, 
  layerErrors, 
  layerLoading 
}) => {
  return (
    <div className="layer-control">
      <h3>🗺️ Contrôle des Couches GeoServer</h3>
      
      {layers.map(layer => (
        <div key={layer.id} className="layer-item">
          <input
            type="checkbox"
            id={layer.id}
            checked={layerVisibility[layer.id]}
            onChange={() => onToggleLayer(layer.id)}
          />
          <label htmlFor={layer.id}>
            {layer.title}
            {layerLoading[layer.id] && ' (Chargement...)'}
          </label>
          
          {/* Affichage des erreurs */}
          {layerErrors[layer.id] && (
            <div className="error-message">
              ❌ Erreur: {layerErrors[layer.id]}
              <br />
              <small>
                Vérifiez:
                <br />• URL GeoServer: correcte
                <br />• Nom de la couche: {layer.name}
                <br />• Style: {layer.style || 'par défaut'}
                <br />• Permissions d'accès
              </small>
            </div>
          )}
          
          {/* Indication de chargement */}
          {layerLoading[layer.id] && (
            <div className="loading-message">
              ⏳ Chargement de la couche...
            </div>
          )}
          
          {/* Informations sur la couche */}
          {layerVisibility[layer.id] && !layerErrors[layer.id] && !layerLoading[layer.id] && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
              Couche: {layer.name} | Opacité: {(layer.opacity * 100).toFixed(0)}%
              {layer.style && ` | Style: ${layer.style}`}
            </div>
          )}
        </div>
      ))}
      
      <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
        💡 <strong>Conseils de dépannage:</strong>
        <br />• Vérifiez que GeoServer est accessible
        <br />• Assurez-vous que les couches existent
        <br />• Vérifiez les styles dans GeoServer
        <br />• Contrôlez les permissions CORS
      </div>
    </div>
  );
};

export default LayerControl;