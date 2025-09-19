# Résolution des Problèmes de Styles WMS avec GeoServer et React Leaflet

## Problème
Les styles WMS appliqués sur GeoServer ne sont pas visibles dans l'application React Leaflet.

## Solutions Implémentées

### 1. Configuration Correcte des Paramètres WMS

Le problème principal est souvent l'omission ou la mauvaise configuration du paramètre `styles` dans la requête WMS. Cette application implémente les corrections suivantes :

#### Paramètre `styles` requis
```typescript
const wmsOptions: L.WMSOptions = {
  layers: 'agriculture:parcelles_agricoles',
  styles: 'parcelles_style', // CRITIQUE: Nom du style défini dans GeoServer
  format: 'image/png',
  transparent: true,
  version: '1.1.1'
};
```

### 2. Support des Méthodes de Stylisation

#### Styles Nommés (Recommandé)
```typescript
{
  url: 'http://localhost:8080/geoserver/agriculture/wms',
  layers: 'agriculture:parcelles_agricoles',
  styles: 'parcelles_style', // Nom du style dans GeoServer
}
```

#### SLD (Styled Layer Descriptor)
```typescript
{
  url: 'http://localhost:8080/geoserver/agriculture/wms',
  layers: 'agriculture:zones_irrigation',
  sld: 'http://localhost:8080/geoserver/styles/irrigation_zones.sld',
}
```

#### SLD Inline
```typescript
{
  url: 'http://localhost:8080/geoserver/agriculture/wms',
  layers: 'agriculture:zones_irrigation',
  sld_body: '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor>...</StyledLayerDescriptor>',
}
```

### 3. Vérifications Nécessaires

#### Dans GeoServer :
1. **Vérifier que le style existe** : Aller dans "Styles" et confirmer que le style `parcelles_style` est bien défini
2. **Associer le style à la couche** : Dans "Layers" > [votre couche] > "Publishing" > "Default Style"
3. **Tester l'URL WMS** : Utiliser l'aperçu de couche dans GeoServer pour vérifier que le style s'applique

#### Dans l'application :
1. **Console du navigateur** : Vérifier les messages de débogage et les erreurs réseau
2. **Onglet Network** : Inspecter les requêtes WMS pour vérifier que le paramètre `styles` est inclus
3. **URL complète** : Vérifier que l'URL ressemble à :
   ```
   http://localhost:8080/geoserver/agriculture/wms?
   service=WMS&version=1.1.1&request=GetMap&
   layers=agriculture:parcelles_agricoles&
   styles=parcelles_style&
   format=image/png&transparent=true
   ```

### 4. Dépannage Courant

#### Problème : Aucun style appliqué
- **Cause** : Paramètre `styles` manquant ou incorrect
- **Solution** : Vérifier le nom exact du style dans GeoServer

#### Problème : Erreur HTTP 400
- **Cause** : Nom de style inexistant
- **Solution** : Créer le style dans GeoServer ou corriger le nom

#### Problème : Couche visible mais sans style
- **Cause** : Style par défaut utilisé au lieu du style spécifié
- **Solution** : Vérifier l'orthographe du nom de style

#### Problème : CORS
- **Cause** : GeoServer bloque les requêtes cross-origin
- **Solution** : Configurer CORS dans GeoServer ou utiliser un proxy

### 5. Configuration GeoServer Recommandée

#### web.xml (pour CORS)
```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>http://localhost:3000</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 6. Exemple d'URL WMS Complète

```
http://localhost:8080/geoserver/agriculture/wms?
service=WMS&
version=1.1.1&
request=GetMap&
layers=agriculture:parcelles_agricoles&
styles=parcelles_style&
format=image/png&
transparent=true&
width=256&
height=256&
srs=EPSG:3857&
bbox={bbox}
```

## Utilisation

1. **Configurer GeoServer** avec vos couches et styles
2. **Modifier les configurations WMS** dans `src/App.tsx`
3. **Lancer l'application** : `npm run dev`
4. **Vérifier dans la console** les messages de débogage

## Structure du Projet

```
src/
├── components/
│   ├── AgricultureMap.tsx    # Composant carte principal
│   └── WMSTileLayer.tsx      # Composant couche WMS avec support des styles
├── types/
│   └── wms.ts                # Types TypeScript pour WMS
├── utils/
│   └── wms.ts                # Utilitaires pour construire les URLs WMS
└── App.tsx                   # Configuration des couches WMS
```