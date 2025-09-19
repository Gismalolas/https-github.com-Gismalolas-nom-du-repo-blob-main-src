# Guide de Dépannage GeoServer avec React Leaflet

Ce guide vous aide à résoudre les problèmes courants d'intégration entre GeoServer et React Leaflet.

## 🔍 Problèmes Courants et Solutions

### 1. Les couches ne s'affichent pas

**Symptômes:**
- Les couches sont cochées mais ne s'affichent pas sur la carte
- Messages d'erreur dans la console du navigateur

**Solutions à vérifier:**

#### A. Vérifier la configuration GeoServer
```javascript
// Dans src/config/geoserver.js, vérifiez :
export const GEOSERVER_CONFIG = {
  server: {
    baseUrl: 'http://localhost:8080/geoserver', // ✅ URL correcte ?
    workspace: 'agriculture', // ✅ Workspace existe ?
  },
  defaultLayers: [
    {
      name: 'agriculture:parcelles_agricoles', // ✅ Nom exact de la couche ?
      style: 'parcelles_style', // ✅ Style existe dans GeoServer ?
    }
  ]
};
```

#### B. Tester l'URL WMS manuellement
Ouvrez cette URL dans votre navigateur :
```
http://localhost:8080/geoserver/agriculture/wms?service=WMS&version=1.1.0&request=GetCapabilities
```

Si ça ne fonctionne pas :
- ✅ GeoServer est-il démarré ?
- ✅ Le workspace "agriculture" existe-t-il ?
- ✅ Les couches sont-elles publiées ?

#### C. Vérifier les permissions CORS
Si vous avez des erreurs CORS, ajoutez dans votre `web.xml` de GeoServer :
```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>http://localhost:3000</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.methods</param-name>
    <param-value>GET,POST,HEAD,OPTIONS</param-value>
  </init-param>
</filter>
```

### 2. Les styles ne s'appliquent pas

**Symptômes:**
- Les couches s'affichent mais avec le style par défaut
- Les couleurs/symboles ne correspondent pas à ce qui est configuré dans GeoServer

**Solutions:**

#### A. Vérifier que le style existe
1. Connectez-vous à l'interface d'administration GeoServer
2. Allez dans "Styles"
3. Vérifiez que le style mentionné dans votre configuration existe

#### B. Associer le style à la couche
1. Allez dans "Layers" dans GeoServer
2. Sélectionnez votre couche
3. Dans l'onglet "Publishing", vérifiez le "Default Style"
4. Dans "Available Styles", ajoutez vos styles personnalisés

#### C. Forcer l'utilisation du style dans l'URL WMS
```javascript
// Dans votre composant React
<WMSTileLayer
  url={`${config.baseUrl}/${config.workspace}/wms`}
  layers={layer.name}
  styles={layer.style} // ✅ Bien spécifier le style
  format="image/png"
  transparent={true}
/>
```

#### D. Tester le style manuellement
Testez cette URL dans votre navigateur :
```
http://localhost:8080/geoserver/agriculture/wms?service=WMS&version=1.1.0&request=GetMap&layers=agriculture:parcelles_agricoles&styles=parcelles_style&bbox=1,46,3,48&width=512&height=512&srs=EPSG:4326&format=image/png&transparent=true
```

### 3. Performance lente

**Symptômes:**
- Les couches mettent du temps à se charger
- La navigation sur la carte est lente

**Solutions:**

#### A. Optimiser la configuration WMS
```javascript
// Dans src/config/geoserver.js
wmsParams: {
  version: '1.1.0',
  format: 'image/png',
  transparent: true,
  tiled: true, // ✅ Active le tiling
  tilesorigin: '-20037508.34,-20037508.34', // ✅ Origine des tuiles
  buffer: 0, // ✅ Réduit le buffer
}
```

#### B. Configurer le cache dans GeoServer
1. Installez le plugin GeoWebCache
2. Configurez le cache pour vos couches les plus utilisées
3. Activez le tiling pour les couches lourdes

#### C. Limiter les niveaux de zoom
```javascript
{
  id: 'parcelles',
  name: 'agriculture:parcelles_agricoles',
  minZoom: 10, // ✅ Ne charge qu'à partir du zoom 10
  maxZoom: 18, // ✅ Limite le zoom maximum
}
```

### 4. Erreurs d'authentification

**Symptômes:**
- Erreurs 401 ou 403
- Certaines couches ne se chargent pas

**Solutions:**

#### A. Vérifier les permissions dans GeoServer
1. Allez dans "Security" > "Data"
2. Vérifiez les règles d'accès pour votre workspace
3. Assurez-vous que l'accès anonyme est autorisé si nécessaire

#### B. Configurer l'authentification si nécessaire
```javascript
// Si vous avez besoin d'authentification
const authParams = btoa(`${username}:${password}`);
const wmsUrl = `${baseUrl}/wms?${params}&auth=${authParams}`;
```

### 5. Problèmes de projection/coordonnées

**Symptômes:**
- Les couches s'affichent au mauvais endroit
- Décalage géographique

**Solutions:**

#### A. Vérifier la projection des données source
```sql
-- Dans PostGIS, vérifiez la projection
SELECT Find_SRID('public', 'parcelles_agricoles', 'geom');
```

#### B. Configurer la bonne projection dans GeoServer
1. Dans "Stores", vérifiez la projection de votre source de données
2. Dans "Layers", vérifiez le "Native SRS" et "Declared SRS"
3. Utilisez "Reproject" si nécessaire

#### C. Forcer la projection dans l'URL WMS
```javascript
// Utiliser EPSG:3857 (Web Mercator) pour Leaflet
srs: 'EPSG:3857'
```

## 🛠️ Outils de Debug

### 1. Console du navigateur
Ouvrez les outils de développement (F12) et regardez :
- Console : erreurs JavaScript
- Network : requêtes WMS qui échouent
- Elements : vérifiez que les éléments Leaflet sont bien créés

### 2. Tester les URLs WMS
Copiez les URLs WMS depuis l'onglet Network et testez-les directement dans le navigateur.

### 3. Logs GeoServer
Consultez les logs GeoServer dans :
- `GEOSERVER_DATA_DIR/logs/geoserver.log`
- Activez le debug pour plus de détails

### 4. Utiliser QGIS pour tester
Ajoutez vos couches WMS dans QGIS pour vérifier qu'elles fonctionnent en dehors de votre application web.

## 📝 Checklist de vérification

Avant de signaler un problème, vérifiez :

- [ ] GeoServer est démarré et accessible
- [ ] Le workspace existe et est publié
- [ ] Les couches existent et sont publiées
- [ ] Les styles existent et sont associés aux couches
- [ ] Les permissions d'accès sont correctes
- [ ] La configuration CORS est en place si nécessaire
- [ ] Les URLs WMS fonctionnent manuellement
- [ ] Les projections sont correctes
- [ ] Les niveaux de zoom sont appropriés

## 🔗 Ressources utiles

- [Documentation GeoServer](https://docs.geoserver.org/)
- [Documentation React Leaflet](https://react-leaflet.js.org/)
- [Spécification WMS](https://www.ogc.org/standards/wms)
- [Guide CORS pour GeoServer](https://docs.geoserver.org/stable/en/user/production/container.html#cross-origin-resource-sharing-cors)