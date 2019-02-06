---
title: API
sidebarDepth: 2
---

# API

## API de gestion des environnements

Cette API disponible sur le serveur Docker a pour but de gérer l'environnement lié à Docker en permettant d'utiliser les fonctionnalités de base de Docker et plus particulièrement la création d'images soumises par les administrateurs.

### lister les images disponibles
```
/env/images
```
Réponse Json :
```
{
  "data": {
      [
        {
          'tag' : 'tag1',
          'id' : 'id1',
          'label' : ['label1','label2']
        }
      ]
  }
}
```

### lister les conteneurs en fonctionnement
```
/env/containers
```
Réponse Json :
```
{
  "data": {
      [
        {
          'name' : 'name1',
          'id' : 'id1',
        }
      ]
  }
}
```

### ajouter une nouvelle image
```
POST /env/add/{tag}
```
Réponse Json :
```
{
  "data": {
      "message" => "building in progress"
  }
}
```

### supprimer une image
```
/env/delete/{image}
```
Réponse Json :
```
{
  "data": {
      "message" => "container started"
  }
}
```

### récupère les logs d'un container
```
/env/log/{id}
```
Réponse HTTP avec le contenu des logs du conteneur

## API  de gestion de projet

### Récupérer les informations d'un projet
```
GET /api/projet/{idProject}/
```

Retour :
```json
{
    "data": {
        "id": "{idProject}",
        "name": "project_name",
        "user_id": "{user_id}",
        "environnement_id": "{environnement_id}",
        "is_public": "true",
        "is_archived": "false",
        "created_at": "1977-04-22T01:00:00-05:00", //ISO 8061 time format
        "updated_at": "1977-04-22T01:00:00-05:00" //ISO 8061 time format
    }
}
```

### Récuperer tous les projets selon des filtres
```
GET /api/projects?{query}
```
Avec les filtres suivant:
* `user` : nom de l'utilisateur
* `name` : nom du projet
* `page` : numéro de la page

Retour:
```json
{
    "data": [
        {
            "id": "{idProject}",
            "name": "project_name",
            "user_id": "{user_id}",
            "environnement_id": "{environnement_id}",
            "is_public": "true", //or "false"
            "is_archived": "false", //or "false"
            "created_at": "1977-04-22T01:00:00-05:00", //ISO 8061 time format
            "updated_at": "1977-04-22T01:00:00-05:00" //ISO 8061 time format   
        },
        {
            "id": "{idProject}",
            "name": "project_name",
            "user_id": "{user_id}",
            "environnement_id": "{environnement_id}",
            "is_public": "true",
            "is_archived": "false",
            "created_at": "1977-04-22T01:00:00-05:00", //ISO 8061 time format
            "updated_at": "1977-04-22T01:00:00-05:00" //ISO 8061 time format
        },
        ...
    ],
    "meta": {
        "page": "2",
        "next": "/api/project?page=1&{filtres}", //Null si pas de page précedente
        "previous" : "/api/project?page=3&{filtres}", //Null si pas de page suivante
    }
}
```
Seul les projets visibles par l'utilisateur effectuant la requête sont retournés.

### Créer un nouveau projet
```
POST /api/project
```
```json
{
    "data": {
        "name": "new_project_name",
        "envionnement_id": "{environnement_id}",
        "is_public": "false", //or "true"
    }
}
```
Les champs `name` et `environnemnt_id` sont requis. Le champ `is_public` prend la valeur `false` par default.
Le nom d'un projet est unique par utilisateur.

Retour si requête valide (code HTTP 200) :
```json
{
    "data": {
        "id": "{idProject}",
        "name": "project_name",
        "user_id": "{user_id}", // id de l'utilisateur ayant effectué la requête
        "environnement_id": "{environnement_id}",
        "is_public": "true",
        "is_archived": "false",
        "created_at": "1977-04-22T01:00:00-05:00", //ISO 8061 time format
        "updated_at": "1977-04-22T01:00:00-05:00" //ISO 8061 time format
    }
}
```

### Modifier les informations d'un projet
```
PUT /api/project/{idProject}
```
```json
{
    "data": {
        "name": "updated_project_name",
        "envionnement_id": "{environnement_id}",
        "is_public": "false", //or "true",
        "is_archived": "true" // Si mis à true, ne peut plus être mis à vrai ensuite
    }
}
```
Aucun champ n'est requis. Les champs omis sont traités avec la valeur existante sur le serveur.

Le retour est le même que pour la création.

### Supprimer un projet

```
DELETE /api/project/{idProject}
```

Reponse : code HTTP 200 (corps vide) si succès.

Cette action supprime également tous les fichiers liés au projet.
