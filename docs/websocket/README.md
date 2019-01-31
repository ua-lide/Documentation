# Exécution du code utilisateur

## Fonctionnement du serveur Websocket

TODO ratchet & boucle d'évenement.

## Protocole d'échange

### Format des messages

Les messages sont échangés sous format JSON, contenant les champs suivants :

* `type` : non null, chaine de caractère correspondant au type du messages.
* `data` : non null, objet json, dont le contenu contient des informations dépendant du type du message.

### Initialisation de la connexion

Une fois la connexion établie, le client doit envoyer un premier message permettant de l'identifier.

Ce message est de type `auth`, et le l'objet `data` du message doit contenir les champs suivants :

* `jwt` : le token d'authentification de l'utilisateur
* `project_id` : l'id du projet utilisé par l'utilisateur

Si le jwt n'est pas valide, le projet n'existe pas ou n'appartient pas à l'utilisateur, la connexion est immédiatement fermé par le serveur.

Si un message qui n'est pas un message d'authentification est envoyé avant que le client soit authentifié, la connexion est immédiatement fermé par le serveur.

### Message d'erreur

Ces messages sont envoyé suite à un message client ne pouvant pas être traité par le serveur (par exemple, écrire sur l'entrée standard alors qu'aucun programme n'est en cours d'exécution). Ces messages sont principalement envoyé à des fins de debugging lors du développement.

* Type : `error`
* Champs de l'objet data :
  * `message` : chaîne de caractère décrivant l'erreur.

### Messages envoyés par le serveur

#### Sortie d'un programme en cours d'éxecution

* Type : `out`
* Champs de l'objet data : 
  * `stdout` : chaîne de caractère correspondant à la sortie du programme sur `STDOUT`.
  * `stderr` : chaîne de caractère correspondant à la sortie du programme sur `STDERR`.

Les champs `stdout` et `stderr` peuvent être absent, mais un des deux est obligatoirement présent.

#### Status d'un programme

* Type : `status`
* Champs de l'objet data :
  * `is_running` :  booléen, vrai si un programme est en cours d'exécution, faux sinon.

### Messages envoyés par le client

#### Lancement de l'exécution d'un programme

* Type : `execute`
* Champs de l'objet data :
  * `image` : nom de l'environnement (correspond au nom de l'image docker).
  * `compile_options` : options de compilation, géré par le script d'exécution de l'environnement choisi.
  * `launch_options` : argument à passer à l'exécution du programme, géré par le script d'exécution de l'environnement choisi.

À la reception de ce message, le serveur websocket lance l'exécution du code du projet (selectionné à l'initialisation connexion).

#### Forcer l'arrêt d'un programme en cours d'exécution

* Type: `force_stop`
* Champs de l'objet data : aucun.

À la reception de ce message, si l'utilisateur a un programme en cours d'exécution, ce programme est stoppé (arrêt du conteneur). Si l'utilisateur n'a pas de programme en cours d'exécution, le message est ignoré.

#### Écrire sur l'entrée standard d'un programme

* Type : `input`
* Champs de l'objet data :
  * `input` : chaîne de caractère à écrire sur l'entrée standard (STDIN) du programme
