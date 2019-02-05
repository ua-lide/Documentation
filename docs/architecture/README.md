# Architecture

Le projet est divisée en deux applications distinctes :

* La [première application](#lide) (référée en tant que "application web" ou "serveur web" ou "lide") accueille toute la partie applicative :
  * Administration
  * Gestion des utilisateurs, authentification
  * Mise à dispositions des assets web (html, css, js, images)
* La [seconde application](#project-manager-app) (référée en tant que "application métier" ou "Project Manager App" [PMA]) accueille la partie métier du site :
  * Gestion du code des utilisateurs
  * Compilation et exécution du code
  * Module de déploiement automatisé des images Docker

![Image schéma architecture](./architecture.png)

## Lide

### Gestion des utilisateurs

La gestion des utilisateurs s'appuie sur le bundle [FOSUserBundle](https://symfony.com/doc/current/bundles/FOSUserBundle/index.html).

Les utilisateurs s'inscrivent en définissant un nom d'utilisateur, un mot de passe et une adresse mail. L'adresse mail est limité à une liste de domaine (configurable, dans notre cas les adresses mail universitaire, finissant par `@etud.univ-angers.fr` et `@univ-angers.fr`).

### Administration

L'interface d'administration est géré par le bundle [EasyAdmin](https://symfony.com/doc/master/bundles/EasyAdminBundle/index.html).

Elle est accessible uniquement aux administrateurs (utilisateurs ayant le role `ROLE_ADMIN`), et permet la modification des informations relatives aux environnement d'exécution des programmes : ajout d'environnement (avec déploiement automatisé, voir le [module de déploiement automatisée des images docker](#module-deploiement-automatisé-des-images-docker) du l'application métier), et définition de modèles de fichiers.

### Assets Web

Voir la partie [FrontEnd](/frontend/).

## Project Manager App

 L'authentification sur cette application se fait au moyen de [Json Web Tokens (JWT)](https://jwt.io/), émis par l'application web. Plus de détail sont disponible dans la partie [authentification](/authentification/).

### Gestion du code des utilisateurs

Le code des utilisateur est géré par le bundle `APIProjectBundle`. Ce bundle met à disposition une API CRUD permettant :

* La gestion de projets, c'est à dire un ensemble de fichiers. L'api permet de créer, modifier, supprimer et récupérer les projets de l'utilisateur.
* La gestions des fichiers d'un projets. Chaque fichier est lié à un projet. Les données concernant un fichier (nom, chemin relatif à la racine du dossier du projet, date de création/dernière modification) sont stockées en base de données. Le contenu des fichiers est stocké dans le système de fichier du serveur. Le dossier où sont stockés les fichiers est défini dans les paramètres de l'application.

### Compilation et exécution du code

La compilation et l'exécution du code sont effectués dans des conteneurs dockers. La gestion de ses conteneurs sont effectués par un serveur WebSocket, auquel l'utilisateur se connecte. L'utilisateur envoie des commandes au serveur websocket, afin de :

* Lancer la compilation et l'exécution d'un programme
* Écrire sur l'entrée standard (stdin) d'un programme en cours d'exécution
* Vérifier le statut d'un programme
* Forcer l'arrêt d'un programme

Plus de détails sont disponibles dans la partie [Exécution du code utilisateur](/websocket/)

### Module de déploiement automatisé des images Docker

L'application met à disposition une API permettant d'automatisé le déploiement de nouvelles images docker pour l'exécution des programmes des utilisateurs. Cette API est utilisée par la partie Administration du serveur applicatif, et n'est accessible que par le serveur applicatif.

### Sécurisation
La sécurisation de la communication entre les deux applications se fait via [SSL mutuel](https://onlinehelp.tableau.com/current/server/fr-fr/ssl_mutual_about.htm). Pour cela il faut générer les certificats (clients ET serveurs) pour chaque application. Vous pouvez obtenir ces certificats depuis une Autorité de Certification officielle (à utiliser en production) ou créer votre propre Autorité de Certification pour signer vos certificats (méthode choisie pour les développements). Vous trouverez les différentes étapes suivies pour générer l'Autorité de Certification et pour la signature des certificats sur ce [ tutoriel](https://jamielinux.com/docs/openssl-certificate-authority/introduction.html).
