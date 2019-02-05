---
title: Installation
sidebarDepth: 2
---

# Déploiement

Les sources permettant d'assurer le déploiement se trouvent de le repository [vagrant-set-up](https://gitlab.com/ua-lide/vagrant-set-up).
Le déploiement se fait grâce à [Vagrant](https://www.vagrantup.com/docs/) qui permet de créer les machines virtuelles.  
Cette documentation à pour but d'expliquer comment fonctionne le repository et le déploiement mais ne fait pas office de procédure de déploiement, pour cela veuillez vous référer à la [procédure d'installation](/installation/).

## Structure du repository
### Vagrantfile
Fichier exécuté par Vagrant permettant de créer les VMs. Ce fichier va se servir de la configuration définies de le fichier `configuration/server-config.yml`.

### Configuration des machines virtuelles
La configuration des VMs se situe dans le dossier `configuration`. Lorsque Vagrant va lancer la création des VMs, il va charger le fichier `configuration/server-config.yml` qui n'existe pas par défaut dans le repository, il vous faudra renommer le fichier `configuration/server-config.yml.example` à la main en remplissant les bonnes informations à l'intérieur.  
Voici un exemple commenté :
```yaml
- hostname: "web-front" # Nom de la VM
  ip: "192.168.50.4" # IP privée de la VM
  box: "ubuntu/trusty64" # Image de base
  apache: "lide.test.conf" # Fichier de configuration Apache situé dans le dossier du repository files/apache.conf.d/
  synced_folders:
    - src: "/path/to/lide" # Chemin vers les sources de LIDE sur  votre host
      dest: "/home/vagrant/LIDE" # Chemin vers les sources de LIDE sur  la VM
      type: "symfony_app" # Permet d'activer la creation automatique des schemas en base avec symfony
      options: # Personnaliser les droits sur les fichiers montés
        :create: true
        :owner: www-data
        :group: vagrant
        :mount_options: ['dmode=0775', 'fmode=0775']
  provision: # Scripts a executer pour provisionner la VM (installation apache, php, ...)
    - "provision/common/common.sh"
    - "provision/apache/apache2.sh"
    - "provision/mariadb/mariadb.sh"
    - "provision/php/php7.2.sh"
    - "provision/misc/misc-web.sh"

- hostname: "web-back"
  ip: "192.168.50.5"
  box: "ubuntu/trusty64"
  apache: "lide-pma.conf"
  docker: # Permet d'automatiser la création d'une image docker sur la VM
    - "gpp" # Le nom du dockerfile sera le nom de l'image sur le guest
  synced_folders:
    - src: "/path/to/lide-project-manager-app" # TO CHANGE
      dest: "/home/vagrant/lide-pma"
      type: "symfony_metier"
      options:
        :create: true
        :owner: www-data
        :group: vagrant
        :mount_options: ['dmode=0775', 'fmode=0775']
  provision:
    - "provision/common/common.sh"
    - "provision/docker/docker.sh"
    - "provision/apache/apache2.sh"
    - "provision/php/php7.2.sh"
```

### Les fichiers
Les différents fichiers nécessaires au bon fonctionnement des applications sont placés dans le dossier `files`.  
Dans ce dossier on va retrouver :  
- les configurations Apache des deux applications dans le dossier `apache.conf.d`
- les fichiers `parameters.yml` de Symfony pour chacune des applications  dans le dossier `symfony.conf.d`
- les Dockerfiles pour créer des images Docker directement lors de la création de la VM dans le dossier `dockerfiles.d`

### Les scripts de déploiement
Les scripts de déploiement permettent de provisionner les VMs comme bon nous semble. Ils sont situés dans le dossier `provision`.  
Pour que le script soit exécuté il faut renseigner le chemin jusqu'au script dans le fichier `configuration/server-config.yml` dans la partie `provision`.

## Commandes importantes de Vagrant
Lancement des VMs (création des VMs si inexistantes) :
```
vagrant up <nom_vm>
```

Accès SSH aux VMs :
```
vagrant ssh <nom_vm>
```

Arrêt des VMs :
```
vagrant halt <nom_vm>
```

Destruction des VMs :
```
vagrant destroy <nom_vm>
```

::: tip
Pour lancer une action sur toutes les VMs il suffit de ne pas spécifier le nom de la VM
:::

## La machine virtuelle web-front
Cette VM correspond à la partie front de l'application, à savoir LIDE. Le répertoire des sources de LIDE y est monté dans la VM et partagé (attention au modification à chaud dans la VM, celles-ci seront répercutées en local). Un lien symbolique est créé entre les sources et le dossier `/var/www`.
La machine est provisionnée comme suit :
- `provision/common/common.sh` : Installation d'un swap pour améliorer les performances
- `provision/apache/apache2.sh` : Installation d'un Apache 2.X
- `provision/mariadb/mariadb.sh` : Installation de MariaDB
- `provision/php/php7.2.sh` : Installation de PHP 7.2 avec les dépendances nécessaires pour le bon fonctionnement avec apache et symfony
- `provision/misc/misc-web.sh` : Installation de divers outils pour le devéloppement web (yarn, nodeJS)

## La machine web-back
Cette VM correspond à la partie applicative de l'application, à savoir LIDE Project Manager App. Comme pour la  machine web-front les sources sont montées et partagées. Un lien symbolique est créé entre les sources et le dossier `/var/www`.
La machine est provisionnée comme suit :
- `provision/common/common.sh` : Installation d'un swap pour améliorer les performances
- `provision/docker/docker.sh` : Installation de Docker
- `provision/apache/apache2.sh` : Installation d'un Apache 2.X
- `provision/php/php7.2.sh` : Installation de PHP 7.2 avec les dépendances nécessaires pour le bon fonctionnement avec apache et symfony
