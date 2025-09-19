# Exemple de Configuration GeoServer

Ce fichier contient des exemples de configuration pour différents types de données agricoles avec GeoServer.

## 📋 Configuration de base

Copiez et adaptez cette configuration dans `src/config/geoserver.js` :

```javascript
export const GEOSERVER_CONFIG = {
  server: {
    // 🔧 IMPORTANT : Modifiez cette URL selon votre installation
    baseUrl: 'http://localhost:8080/geoserver',
    // Ou pour un serveur distant :
    // baseUrl: 'https://mon-serveur.agriculture.fr/geoserver',
    
    workspace: 'agriculture', // Nom de votre workspace
  },

  defaultLayers: [
    // 🌾 Exemple : Parcelles agricoles
    {
      id: 'parcelles',
      name: 'agriculture:parcelles_agricoles',
      title: 'Parcelles Agricoles',
      description: 'Délimitation des parcelles agricoles',
      style: 'parcelles_polygons', // Style créé dans GeoServer
      opacity: 0.7,
      visible: true,
      minZoom: 8,
      maxZoom: 18
    },

    // 🌱 Exemple : Types de cultures
    {
      id: 'cultures',
      name: 'agriculture:types_cultures',
      title: 'Types de Cultures',
      description: 'Classification des cultures par parcelle',
      style: 'cultures_choropleth', // Style avec couleurs selon type
      opacity: 0.8,
      visible: false,
      minZoom: 10,
      maxZoom: 18
    },

    // 💧 Exemple : Systèmes d'irrigation
    {
      id: 'irrigation',
      name: 'agriculture:reseaux_irrigation',
      title: 'Réseaux d\'Irrigation',
      description: 'Canaux et systèmes d\'irrigation',
      style: 'irrigation_lines', // Style pour lignes
      opacity: 0.6,
      visible: false,
      minZoom: 12,
      maxZoom: 18
    },

    // 🏞️ Exemple : Types de sols
    {
      id: 'sols',
      name: 'agriculture:pedologie',
      title: 'Types de Sols',
      description: 'Classification pédologique',
      style: 'sols_gradient',
      opacity: 0.5,
      visible: false,
      minZoom: 8,
      maxZoom: 16
    },

    // 🌡️ Exemple : Stations météo
    {
      id: 'meteo',
      name: 'agriculture:stations_meteo',
      title: 'Stations Météorologiques',
      description: 'Points de mesure météorologique',
      style: 'meteo_symbols', // Style avec symboles
      opacity: 1.0,
      visible: false,
      minZoom: 6,
      maxZoom: 18
    }
  ]
};
```

## 🎨 Exemples de Styles SLD

### Style pour parcelles agricoles (parcelles_polygons.sld)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>parcelles_polygons</Name>
    <UserStyle>
      <Name>Parcelles Agricoles</Name>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#90EE90</CssParameter>
              <CssParameter name="fill-opacity">0.7</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#228B22</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

### Style pour types de cultures (cultures_choropleth.sld)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>cultures_choropleth</Name>
    <UserStyle>
      <Name>Types de Cultures</Name>
      <FeatureTypeStyle>
        <!-- Blé -->
        <Rule>
          <Filter>
            <PropertyIsEqualTo>
              <PropertyName>type_culture</PropertyName>
              <Literal>ble</Literal>
            </PropertyIsEqualTo>
          </Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#FFD700</CssParameter>
              <CssParameter name="fill-opacity">0.8</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#DAA520</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
        
        <!-- Maïs -->
        <Rule>
          <Filter>
            <PropertyIsEqualTo>
              <PropertyName>type_culture</PropertyName>
              <Literal>mais</Literal>
            </PropertyIsEqualTo>
          </Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#32CD32</CssParameter>
              <CssParameter name="fill-opacity">0.8</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#228B22</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
        
        <!-- Tournesol -->
        <Rule>
          <Filter>
            <PropertyIsEqualTo>
              <PropertyName>type_culture</PropertyName>
              <Literal>tournesol</Literal>
            </PropertyIsEqualTo>
          </Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#FF6347</CssParameter>
              <CssParameter name="fill-opacity">0.8</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#CD5C5C</CssParameter>
              <CssParameter name="stroke-width">1</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

### Style pour réseaux d'irrigation (irrigation_lines.sld)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>irrigation_lines</Name>
    <UserStyle>
      <Name>Réseaux Irrigation</Name>
      <FeatureTypeStyle>
        <Rule>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#1E90FF</CssParameter>
              <CssParameter name="stroke-width">2</CssParameter>
              <CssParameter name="stroke-dasharray">5 2</CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

## 🗄️ Structure des données recommandée

### Table parcelles_agricoles
```sql
CREATE TABLE parcelles_agricoles (
    id SERIAL PRIMARY KEY,
    numero_parcelle VARCHAR(50),
    surface_ha DECIMAL(10,2),
    proprietaire VARCHAR(100),
    commune VARCHAR(100),
    geom GEOMETRY(POLYGON, 4326)
);
```

### Table types_cultures
```sql
CREATE TABLE types_cultures (
    id SERIAL PRIMARY KEY,
    parcelle_id INTEGER REFERENCES parcelles_agricoles(id),
    type_culture VARCHAR(50), -- 'ble', 'mais', 'tournesol', etc.
    annee INTEGER,
    rendement_tonne_ha DECIMAL(5,2),
    geom GEOMETRY(POLYGON, 4326)
);
```

### Table stations_meteo
```sql
CREATE TABLE stations_meteo (
    id SERIAL PRIMARY KEY,
    nom_station VARCHAR(100),
    temperature_moy DECIMAL(4,2),
    precipitation_mm DECIMAL(6,2),
    geom GEOMETRY(POINT, 4326)
);
```

## 🚀 Démarrage rapide

1. **Créez votre workspace** dans GeoServer :
   - Nom : `agriculture`
   - URI : `http://agriculture.local`

2. **Importez vos données** :
   - Allez dans "Stores"
   - Ajoutez votre source (Shapefile, PostGIS, etc.)

3. **Publiez vos couches** :
   - Allez dans "Layers"
   - Sélectionnez votre store
   - Publiez chaque couche

4. **Créez vos styles** :
   - Allez dans "Styles"
   - Créez un nouveau style avec le SLD correspondant
   - Associez le style à votre couche

5. **Modifiez la configuration** :
   - Adaptez `src/config/geoserver.js` selon vos couches
   - Redémarrez votre application React

## 📍 URLs importantes

- **Interface GeoServer** : `http://localhost:8080/geoserver/web/`
- **Capabilities WMS** : `http://localhost:8080/geoserver/agriculture/wms?service=WMS&request=GetCapabilities`
- **Preview des couches** : `http://localhost:8080/geoserver/agriculture/wms/reflect?layers=agriculture:parcelles_agricoles`

## 🔍 Test rapide

Testez votre configuration avec cette URL GetMap :
```
http://localhost:8080/geoserver/agriculture/wms?
service=WMS&
version=1.1.0&
request=GetMap&
layers=agriculture:parcelles_agricoles&
styles=parcelles_polygons&
bbox=1,46,3,48&
width=512&
height=512&
srs=EPSG:4326&
format=image/png&
transparent=true
```

Si cette URL affiche une image, votre configuration est correcte !