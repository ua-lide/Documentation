---
title: Installation
sidebarDepth: 2
---


# Installation

## Requirements

L'application a besoin des logiciels suivants pour fonctionner correctement :

* PHP 7.2 minimum
* Apache2
* MariaDB (théoriquement fonctionnelle sous PostgreSQL et MySQL, non testé)

Pour une utilisation local, nous proposons des machines virtuelles provisionnées avec les logiciels nécessaires (voir [section "Installation pour le développement](#installation-pour-le-developpement") ci dessous)


## Installation pour le développement

Pour le développement, nous recommandons l'utilisation de [Vagrant](https://www.vagrantup.com/).

Nous considerons ici un système Ubuntu 16.04, puisque c'est la version installé sur les postes mis à disposition par l'Université d'Angers.

### Pré-requis

* [Vagrant](https://www.vagrantup.com/) : Télécharger la dernière version. Vagrant est un outils permettant la gestion de machine virtuelle pour le développement. La mise à disposition de "box", des machine virtuelles déjà configuré, permet de rapidement mettre en place un environnement de développement. **Ne pas l'installer via le gestionnaire de paquet, vous n'aurez pas la bonne version**
* VirtualBox s'il n'est pas déjà installé. Voir la [documentation ubuntu](https://doc.ubuntu-fr.org/virtualbox)


### Mise en place des dossiers sources

Tout d'abord, créer un dossier qui contiendra les trois projets nécessaires au bon fonctionnement de l'application, puis placer vous dans ce dossier.

```bash
mkdir ua-lide && cd ua-lide
```

Cloner ensuite les trois repos du projet :

```bash
git clone git@gitlab.com:ua-lide/vagrant-set-up.git
git clone git@gitlab.com:ua-lide/lide.git
git clone git@gitlab.com:ua-lide/lide-project-manager-app.git
```

::: tip
Le premier repo (vagrant-set-up) contient les fichiers nécessaire à la mise en place des deux machines virtuelles.

Le deuxième repo est la partie applicative (gestion des utilisateurs, authentification, pages du site), et le troisième est la partie métier (gestion des fichiers et projets des utilisateurs, exécution du code des utilisateur).
:::

### Mise en place des clefs pour les JWT

Placez vous dans les sources de la partie applicative :

```bash
cd lide
```

Générer les clefs pour le JWT (mettez la même passphrase partout) :


::: danger
Lancez les commandes de openssl une a une sinon la génération des clefs va échouer
:::

```bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
openssl rsa -in config/jwt/private.pem -out config/jwt/private2.pem
mv config/jwt/private.pem config/jwt/private.pem-back
mv config/jwt/private2.pem config/jwt/private.pem
```


Copier `config/jwt/public.pem` dans les sources de lide-project-manager-app :

```bash
mkdir -p ../lide-project-manager-app/config/jwt
cp config/jwt/public.pem ../lide-project-manager-app/config/jwt/
```

### Déploiement

Placez vous dans votre repo git local des sources pour le déploiement :

```bash
cd vagrant-set-up
```

Modifiez `server-config.yml` situé dans le dossier `configuration` pour y mettre le chemin des sources du projet que vous venez de cloner :

```yaml
- hostname: "web-front"
  ip: "192.168.50.4"
  box: "ubuntu/trusty64"
  apache: "lide.test.conf"
  synced_folders:
    - src: "/path/to/folder/lide" # CHEMIN A CHANGER VERS LES SOURCES DE LA PARTIE APPLICATIVE : LIDE
      dest: "/home/vagrant/LIDE"
      type: "symfony_app" # Permet d'activer la creation automatique des schemas en base avec symfony
      options:
        :create: true
        :owner: www-data
        :group: vagrant
        :mount_options: ['dmode=0775', 'fmode=0664']
  provision:
    - "provision/common/common.sh"
    - "provision/apache/apache2.sh"
    - "provision/mariadb/mariadb.sh"
    - "provision/php/php7.2.sh"
    - "provision/misc/misc-web.sh"

- hostname: "web-back"
  ip: "192.168.50.5"
  box: "ubuntu/trusty64"
  apache: "lide-pma.conf"
  docker:
    - "gpp" # Le nom du dockerfile sera le nom de l'image sur le guest
  synced_folders:
    - src: "/path/to/folder/lide-project-manager-app" # CHEMIN A CHANGER VERS LES SOURCES DE LA PARTIE METIER : LIDE PROJECT MANAGER APP
      dest: "/home/vagrant/lide-pma"
      type: "symfony_metier"
      options:
        :create: true
        :owner: www-data
        :group: vagrant
        :mount_options: ['dmode=0775', 'fmode=0664']
  provision:
    - "provision/common/common.sh"
    - "provision/docker/docker.sh"
    - "provision/apache/apache2.sh"
    - "provision/php/php7.2.sh"
```

Lancez la création des VMs (cette étape peut être longue):

```bash
vagrant up
```


::: tip
Si vous souhaitez accéder aux VMs :

```bash
vagrant ssh <nom_vm>
```

Par défaut les noms des deux VMs crées sont `web-front` et `web-back`
:::


### Lancer Apache et le server Web Socket

::: tip
Ces étapes sont à répeter à chaque lancement des VMs
:::

Connectez-vous à la VM `web-front` :

```bash
vagrant ssh web-front
```

Puis lancer le serveur apache :

```
sudo service apache2 restart
```

La passphrase à entrée est `0f749a59` (si vous n'avez pas modifié les certificats)

Vous pouvez maintenant vous déconnecter de la VM.

Connectez-vous à la VM `web-back`:

```
vagrant ssh web-back
```

Lancez apache et le server Web Socket avec les commande suivante :

```bash
sudo service apache2 restart
cd lide-pma
php bin/console lide:start-server
```

### Modification du fichier /etc/hosts

Afin de pouvoir accéder au site depuis votre navigateur, vous devez modifié le fichier `/etc/hosts` de votre poste.

```
sudo vim /etc/hosts # Ou n'importe quel éditeur de texte
```

Ajouter les lignes suivantes (si vous n'avez pas modifié la configuration des adresses des box vagrants, sinon adapter au besoin)

```
192.168.50.4 lide.test
192.168.50.5 lide-pma.test
```

Vous pouvez accéder à l'application à l'URL suivante : [http://lide.test/](http://lide.test/)

ou, pour la version en mode développeur [http://lide.test/app_dev.php](http://lide.test/app_dev.php)
