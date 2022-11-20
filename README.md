# cinemate

Cinemate est un réseau social de critique de films.
<br><br> Lien du projet : https://cinemate.onrender.com/

### Projet développé par : 
- Simon Meia
- Marilyn Themo
- Alexandre Souto

## Fonctionnalités
Le but de l'application est de voir l'avis de nos amis ou d'autres utilisateurs sur les derniers films qu'ils ont vus. Le réseau social ne fonctionne pas avec une liste d'amis mais avec des groupes. L'utilisateur peut rejoindre un ou plusieurs groupes pour ensuite avoir accès aux reviews des membres.
<br><br>
Les informations sur les films proviennenent de l'API de [The Movie Database](https://developers.themoviedb.org/3/getting-started/introduction).

## Installation
Prérequis:
- Node.js 13.2+
- Postman
- MongoDB

1. Cloner et pull le repository
```
git pull
```
2. Installer les packages
```
npm i
```
3. Créer un fichier `.env` si vous souhatez modifier les données présentes dans le fichier `config.js`
4. Exécuter l'application
```
npm run dev OU npm run start
```

## Documentation
La documentation de l'API est disponible ici : https://cinemate.onrender.com/api-docs/


## Websocket
L'API utilise des WebSockets pour 2 choses :
1. Notifier les utilisateurs quand une nouvelle review à été postée
2. Notifier les utilisateurs quand un nouvel utilisateur créé son compte

## Improvemens
- [ ] Gestion des erreurs liés au fetch de données de l'API TMDB
- [ ] ...
