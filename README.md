# Application React Leaflet avec GeoServer

Il s'agit de l'environnement client de mon application web sur le front-end de l'agriculture, intégrant des couches GeoServer avec React Leaflet.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 14 ou plus récente)
- npm ou yarn
- GeoServer installé et configuré

### Installation
```bash
# Cloner le repository
git clone <votre-repo>
cd <nom-du-repo>

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🗺️ Configuration GeoServer

### 1. Configuration de base

Modifiez le fichier `src/config/geoserver.js` selon votre installation :

```javascript
export const GEOSERVER_CONFIG = {
  server: {
    baseUrl: 'http://localhost:8080/geoserver', // Votre URL GeoServer
    workspace: 'agriculture', // Votre workspace
  },
  defaultLayers: [
    {
      id: 'parcelles',
      name: 'agriculture:parcelles_agricoles', // Nom complet de la couche
      title: 'Parcelles Agricoles',
      style: 'parcelles_style', // Style défini dans GeoServer
      opacity: 0.7,
      visible: true
    }
    // Ajoutez vos autres couches...
  ]
};
```

### 2. Créer un workspace dans GeoServer

1. Connectez-vous à l'interface d'administration GeoServer
2. Allez dans "Workspaces"
3. Créez un nouveau workspace nommé "agriculture"
4. Définissez l'URI du namespace (ex: `http://agriculture.local`)

### 3. Publier vos données

1. Allez dans "Stores" et ajoutez votre source de données (Shapefile, PostGIS, etc.)
2. Allez dans "Layers" et publiez vos couches
3. Associez les styles appropriés à chaque couche

### 4. Configurer les styles

Créez des styles SLD dans GeoServer pour personnaliser l'apparence de vos couches :

1. Allez dans "Styles"
2. Créez un nouveau style (ex: "parcelles_style")
3. Définissez votre SLD
4. Associez le style à votre couche

## 🎯 Fonctionnalités

### Contrôle des couches
- ✅ Activation/désactivation des couches
- ✅ Gestion de l'opacité
- ✅ Styles personnalisés depuis GeoServer
- ✅ Messages d'erreur détaillés
- ✅ Indicateurs de chargement

### Diagnostic et débogage
- ✅ Vérification de la connexion GeoServer
- ✅ Test des URLs WMS
- ✅ Affichage des capabilities
- ✅ Gestion des erreurs CORS

### Optimisations
- ✅ Tiling pour de meilleures performances
- ✅ Cache des tuiles
- ✅ Limitations de zoom par couche
- ✅ Gestion de la transparence

## 🔧 Dépannage

### Les couches ne s'affichent pas ?

1. **Vérifiez GeoServer** : `http://localhost:8080/geoserver/web/`
2. **Testez les capabilities** : `http://localhost:8080/geoserver/agriculture/wms?service=WMS&request=GetCapabilities`
3. **Vérifiez la console du navigateur** pour les erreurs

### Problèmes de styles ?

1. Vérifiez que le style existe dans GeoServer
2. Assurez-vous qu'il est associé à la couche
3. Testez une URL GetMap directement dans le navigateur

### Erreurs CORS ?

Ajoutez la configuration CORS dans votre `web.xml` de GeoServer :

```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>http://localhost:3000</param-value>
  </init-param>
</filter>
```

Pour plus de détails, consultez le fichier [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 📁 Structure du projet

```
src/
├── components/
│   ├── LayerControl.js      # Contrôle des couches
│   └── GeoServerInfo.js     # Informations de connexion
├── config/
│   └── geoserver.js         # Configuration GeoServer
├── App.js                   # Composant principal
├── index.js                 # Point d'entrée
└── index.css               # Styles CSS
```

## 🛠️ Scripts disponibles

- `npm start` : Démarre l'application en mode développement
- `npm run build` : Construit l'application pour la production
- `npm test` : Lance les tests
- `npm run eject` : Éjecte la configuration (irréversible)

## 📚 Technologies utilisées

- **React** : Framework JavaScript
- **Leaflet** : Bibliothèque de cartes interactives
- **React-Leaflet** : Intégration React pour Leaflet
- **GeoServer** : Serveur de données géospatiales

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez le [guide de dépannage](TROUBLESHOOTING.md)
2. Vérifiez les [issues existantes](../../issues)
3. Créez une nouvelle issue avec tous les détails

---

**Note** : Assurez-vous que votre GeoServer est correctement configuré et accessible avant de démarrer l'application.
