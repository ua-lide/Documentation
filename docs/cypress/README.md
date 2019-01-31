---
title: Tests Cypress
---

# Tests Cypress

[Cypress](https://www.cypress.io/) est un framework de tests, similaire à Selenium. 

Il permet l'écriture de tests end-to-end, d'intégration et unitaires. Nous l'utilisons d'une part afin de tester le front end de l'application indépendament du serveur métier, et d'autre part pour tester l'application dans son ensemble.

## Lancement des tests

Les tests sont défini dans le dossier `cypress` de l'application web. Ils peuvent être lancé grâce aux commandes suivantes :

* `yarn cypress run` permet de lancer tous les tests en mode headless. Des vidéos des tests sont enregistrées dans le dossier `cypress/videos`, permettant ainsi de vérifier l'éxecution des tests.
* `yarn cypress open` permet de lancer l'interface graphique de Cypress. Cette interface permet de lancer des tests, d'examiner leur exécution puis d'interagir avec la page un fois les tests terminés.

Les tests sont défini dans le dossier `cypress/integration`. Les tests sont divisés en deux catégories :

* `e2e`, pour End-To-End : ces tests vérifie le fonctionnement de l'application en conditions réelles. Pour ces tests, ils est nécessaires que les deux applications (web et métier) soit lancées, ainsi que le serveur WebSocket.
* `front-end` : ces tests ont pour but de vérifier le fonctionnement du front end. Seul le serveur applicatif doit être lancé, les requêtes au serveur métier étant remplacé par des stubs. Ces tests permettent également de vérifier le comportement de l'application lorsque le serveur métier renvoie un erreur (chose difficile à mettre en place dans des conditions réelles).

## Mise en place de l'environnement pour les tests

Pour lancer les tests sur votre machine, les manipulations suivantes doivent être effectué :

* Copier le fichier `cypress.env.json.example` vers `cypress.env.json`.
* Modifier les variables de ce fichiers en fonctions de votre environnement :

```json
{
    // L'url de base pour accéder au serveur applicatif
    "baseUrl": "https://lide.test/app_dev.php/",
    // L'url de base du serveur métier
    "basePmaUrl" : "https://lide-pma.test/app_dev.php/", 
    // Un couple username/password valide pour un utilisateur administrateur
    "admin_username" : "admin",
    "admin_pwd": "admin"
}
```

Les applications web et métier doivent être installé et correctement configurées. Se référer à la partie [Installation](/installation/) pour cette partie.