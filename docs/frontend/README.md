---
title: Front End
---

# Front End

Le front end est conçu pour être indépendant des technologies serveurs (actuellement PHP/Symfony) utilisées.

::: tip
Tous les chemins vers des dossiers et fichiers de cette page sont données par rapport à la racine de l'application web (lide).
:::

## Packages Manager : Yarn

Le logiciel [yarn](https://yarnpkg.com/fr/) est utilisé pour la gestions des dépendances front-end.

La listes des dépendances est définie dans le fichier `package.json`. Le rôle de chacune des dépendances est expliqué dans la section [Framework et bibliothèque](#framework-et-bibliotheques).

Le fichier `package.json` défini également des scripts pour les différentes actions possible, permettant ainsi d'exécuter ces actions facilement depuis la ligne de commande :

* `yarn dev` : compile les assets en mode développement
* `yarn watch` : compile les assets en mode développement, puis surveille les fichiers afin de recompilé si une modification est effectuée;
* `yarn build`: compile les assets en mode production (càd avec minimification).
* `yarn test` : lance les tests cypress (voir la [section sur cypress](/cypress/)) en mode headless. Des vidéos des tests sont enregistré dans le dossier `cypress/videos`.
* `yarn cypress open` : lance l'interface cypress (voir la [section sur cypress](/cypress/)).

## Framework et bibliothèques

Le front end de l'application s'appuie sur [VueJS](https://vuejs.org/).

Les packages suivants sont utilisés :

* [Vuetify](https://vuetifyjs.com/en/) est un framework de components VueJS, développé selon les spécification Material Design. Il met a disposition des nombreux composants VueJS.
* [Axios](https://github.com/axios/axios) est un client HTTP permettant d'effectuer des [XMLHttpRequest](https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest) de manière simple, en retournant des Promises, facile à utilisé depuis les composants VueJS.
* [Ace](https://ace.c9.io/) est un editeur de code.

Pour le développement et la compilation, les outils suivants sont utilisés   :

* [Webpack Encore](https://symfony.com/doc/current/frontend.html), un wrapper pour Webpack mettant à disposition une API simple pour le bundling des fichiers javascript, le processing des fichiers CSS et JS, et la compilation et minification des assets. 
* [Cypress](https://www.cypress.io/) est un framework de tests end-to-end. Nous l'utilisons pour tester les en isolations les fonctionnalités du front end, mais aussi pour tester l'application dans son intégralité en simulant une utilisation dans le navigateur.
* [EsLint](https://eslint.org/) est un linter, permettant l'analyse statique du code javascript. Il nous permet de définir des règles de code, qui si non respecté, leverons des erreurs à la compilations des assets.
* [Prettier](https://github.com/prettier/prettier) permet le formatter de manière automatisé le code Javascript. Il permet d'imposer un style de code constant à travers toute l'application.
* Divers loader et plugins webpack pour le traitements des fichiers .vue (vuejs) et scss.


## Système de build : Webpack Encore

[Webpack Encore](https://symfony.com/doc/current/frontend.html) est un wrapper autour de [Webpack](https://webpack.js.org/). La configuration

## Organisations

Tous les fichiers nécessaire au fonctionnement du frontend (à l'exceptions des templates Twig) sont contenus dans le dossier `assets` à la racine de l'application web.

Ce dossier est divisé en plusieurs sous dossiers :

* `css` contient les feuilles de style Sass de l'application. Dans ce dossier, les fichiers préfixés par un underscore sont des fichiers destiné à être inclu dans une feuilles de style maitresse. Le fichier `app.scss` contient tout les styles de l'application et est compilé par webpack lors du build.
* `js` contient les fichiers javascript ainsi que les composants Vue. Il est organisé de la manière suivantes :
  * `components` contient les composants VueJS, organisé par page de l'applications (e.g. le sous dossier `ìde` contient les composants nécessaire par l'interface de l'environnement de développement). Les composants n'appartenant pas à une page spécifique sont placé à la racine.
  * `api` contient les classes permettant de communiquer avec les différentes API de l'application.
  * `ws_connector` contient les classes permettant de communiquer avec le serveur websocket.
  * `event_bus.js` défini un bus d'évenement, permettant de propager des évenement au sein de l'application, pouvant être récupérer par des composants Vue. Voir [cet article](https://alligator.io/vuejs/global-event-bus/) pour plus de détail sur son fonctionnement.
  * Les autres fichiers javascript sont des point d'entrées correspondant chacun à une page de l'application.
* `.vuetify_ide_fixer.js` est un fichier contenant les définitions des composants vuetify, afin d'aider l'autocomplétion de certains ide (principalement PHPStorm/WebStorm).

