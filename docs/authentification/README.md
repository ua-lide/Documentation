# Authentification et Gestion des Utilisateurs


## Gestion des utilisateurs

La gestion des utilisateurs s'appuie sur le Bundle Symfony [FOSUserBundle](https://symfony.com/doc/current/bundles/FOSUserBundle/index.html).

## Authentification dans l'application métier et le serveur WebSocket

L'authentification sur le serveur métier se fait grâce à un Json Web Token.

Les deux applications (web et métier) utilise le bundle [LexitJWTAuthentificationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle) à cet fin.

Le token est émis par l'application web. Il est ensuite utilisé par le frontend, et envoyé avec chaque requête dans le header `XX-LIDE-Authorization`, sous la forme :

```
XX-LIDE-Authorization : Bearer <token>
```

Le token est signé par le serveur web par une clef privée, et la clef publique correspondante est utilisé par le serveur métier pour en vérifier l'authenticité.

Le fichier contenant la clefs publique est défini par le paramètre `jwt_key` dans le fichier `app/config/parameter.yml`.

La payload du token contient l'id de l'utilisateur, son nom d'utilisateur, ses rôles, ainsi que la date d'expiration du token. Par défaut, les tokens sont valides une heure après émissions.

La route `/jwt` sur le serveur applicatif permet à un utilisateur connecté d'obtenir un nouveau token.