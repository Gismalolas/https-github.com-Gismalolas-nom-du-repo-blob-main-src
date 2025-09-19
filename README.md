# Application Agricole - Cartographie avec React Leaflet et GeoServer

Il s'agit de l'environnement client de mon application web sur le front-end de l'agriculture, intégrant une cartographie avec support complet des styles WMS depuis GeoServer.

## 🚨 Problème Résolu : Styles WMS Non Visibles

Cette application résout le problème courant où **les styles WMS appliqués sur GeoServer ne sont pas visibles dans React Leaflet**.

## ✅ Solution Implémentée

### Causes Principales du Problème :
1. **Paramètre `styles` manquant** dans la configuration WMS
2. **Mauvaise configuration** des options de couche Leaflet
3. **Problèmes CORS** avec GeoServer
4. **Version WMS incorrecte** ou paramètres mal formatés

### Corrections Apportées :
- ✅ Configuration correcte du paramètre `styles` dans les requêtes WMS
- ✅ Support des SLD (Styled Layer Descriptor) pour styles avancés
- ✅ Validation des configurations WMS
- ✅ Gestion d'erreurs et débogage
- ✅ Documentation complète du dépannage

## 🛠️ Installation et Utilisation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- GeoServer configuré avec vos couches et styles

### Installation
```bash
npm install
```

### Configuration
1. **Modifiez les configurations WMS** dans `src/App.tsx` :
```typescript
const wmsLayers: WMSLayerConfig[] = [
  {
    url: 'http://votre-geoserver:8080/geoserver/workspace/wms',
    layers: 'workspace:votre_couche',
    styles: 'nom_du_style', // CRITIQUE : Nom exact du style dans GeoServer
    format: 'image/png',
    transparent: true,
    version: '1.1.1'
  }
];
```

2. **Vérifiez dans GeoServer** que :
   - Le style existe dans "Styles"
   - Le style est associé à la couche
   - Les permissions d'accès sont correctes

### Lancement
```bash
# Développement
npm run dev

# Production
npm run build
npm run preview
```

## 📂 Structure du Projet

```
src/
├── components/
│   ├── AgricultureMap.tsx      # Composant carte principal
│   └── WMSTileLayer.tsx        # Couche WMS avec support styles ✨
├── types/
│   └── wms.ts                  # Types TypeScript pour WMS
├── utils/
│   └── wms.ts                  # Utilitaires de construction URL WMS
└── App.tsx                     # Configuration des couches
```

## 🔧 Composant Clé : WMSTileLayer

Ce composant résout le problème des styles WMS :

```typescript
// ✅ Configuration correcte avec styles
<WMSTileLayer
  config={{
    url: 'http://localhost:8080/geoserver/agriculture/wms',
    layers: 'agriculture:parcelles',
    styles: 'parcelles_style', // ESSENTIEL !
    format: 'image/png',
    transparent: true
  }}
/>
```

## 📖 Documentation Complète

Consultez [WMS_STYLES_GUIDE.md](./WMS_STYLES_GUIDE.md) pour :
- Guide de dépannage complet
- Configuration GeoServer
- Exemples d'URLs WMS
- Résolution des erreurs courantes

## 🌐 Fonctionnalités

- ✅ **Support complet des styles WMS** depuis GeoServer
- ✅ **Validation automatique** des configurations
- ✅ **Débogage intégré** avec logs de console
- ✅ **Support SLD** pour styles avancés
- ✅ **Gestion des erreurs** robuste
- ✅ **TypeScript** pour la sécurité des types
- ✅ **Interface responsive** 

## 🚀 Technologies

- **React 19** + **TypeScript**
- **Leaflet** + **React Leaflet** 
- **Vite** pour le build
- **Support WMS/SLD complet**

## 🔍 Débogage

Les messages de débogage dans la console vous aideront :
```javascript
// Console logs automatiques :
"WMS Layer styles parameter set to: parcelles_style"
"WMS Layer created with config: {...}"
```

## 📞 Support

Si les styles ne s'affichent toujours pas :
1. Vérifiez la console pour les erreurs
2. Inspectez l'onglet Network pour voir les requêtes WMS
3. Testez l'URL WMS directement dans le navigateur
4. Consultez le guide de dépannage complet
