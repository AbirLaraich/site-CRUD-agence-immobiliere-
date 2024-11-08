# Frameworks Côté Serveur Docker

## Description

Ce projet est une application côté serveur utilisant **Node.js** et **MongoDB**. Il est Dockerisé pour offrir un environnement portable et cohérent sur différents systèmes. L'application sert de backend avec une connexion MongoDB et utilise des **templates EJS** pour le rendu des vues.

---

## Prérequis

Avant d'exécuter ce projet, vous devez avoir les éléments suivants installés sur votre machine :

- **Docker** (Assurez-vous que Docker et Docker Compose sont installés)
- **Node.js** (Pour le développement et la construction)
- **MongoDB** (Si vous n'utilisez pas la version Dockerisée)

---

## Installation

### 1. Clonez le dépôt

```bash
git clone https://www-apps.univ-lehavre.fr/forge/la233225/frameworks-cote-serveur-docker.git
```
## 2. Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```bash
MONGODB_URI=mongodb://mongo:27017/tondb
```
Remplacez tondb par le nom de votre base de données MongoDB.

## 3. Construire et Lancer l'Application

Vous pouvez utiliser docker-compose pour construire et exécuter l'application dans des conteneurs Docker.
Construire et Démarrer les Conteneurs

```bash
docker-compose up --build
```
## 3.Accéder à l'Application

Une fois l'application lancée, vous pouvez y accéder à l'adresse http://localhost:8000.

## 4.Configuration Docker

Ce projet utilise Docker Compose pour gérer des applications multi-conteneurs. Voici un aperçu du fichier docker-compose.yml :

    Conteneur de l'Application (app)
        Ce conteneur exécute l'application Node.js.
        Ports : 8000 (accessible via localhost)
        Dépendances : MongoDB (conteneur mongo)

    Conteneur MongoDB (mongo)
        Un conteneur MongoDB version 6, exécuté sur le port 27019.
        Les données sont stockées dans un volume Docker pour garantir la persistance des données entre les redémarrages du conteneur.

## 5.Image Docker Multi-Stage

L'image Docker de ce projet utilise une approche **multi-stage** pour séparer le processus de construction et d'exécution de l'application :

    -Stage de construction : L'image de construction (build) installe les dépendances et compile le code TypeScript.

    -Stage de production : L'image de production est plus légère et contient uniquement les fichiers nécessaires à l'exécution de l'application.