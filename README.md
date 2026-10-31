# MDD, Monde de Dév

MDD est un réseau social pour développeurs. Chacun suit des thèmes (langages, frameworks, outils), lit un fil limité à ces thèmes, publie des articles en Markdown et en discute dans les commentaires.

Le projet met l’accent sur l’expérience utilisateur, la cohérence visuelle et la qualité du code.

## Architecture

| Couche             | Technologies                                                       |
| ------------------ | ------------------------------------------------------------------ |
| Backend            | Spring Boot 3.5, Java 21, Spring Security, JWT (JJWT), JPA, Flyway |
| Base de données    | PostgreSQL 16 (Docker)                                             |
| Frontend           | Angular 20 sans zone, NgRx Signals, Tailwind CSS 4                 |
| Rendu des articles | marked, highlight.js, DOMPurify                                    |

Le backend expose une API REST sous `/api`. Le frontend appelle cette API par un proxy de développement (`frontend/proxy.conf.json`).

## Lancer le projet

Prérequis : Docker, Java 21, Node 20 ou plus récent.

1. Copier `infra/.env.example` vers `infra/.env` et renseigner les variables, puis démarrer la base : `docker compose -f infra/compose.yml up -d`.
2. Démarrer le backend avec le profil `dev` : `cd backend/mdd && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`. Flyway crée le schéma, puis un jeu de données d’exemple est injecté (11 utilisateurs, 19 articles, 58 commentaires).
3. Démarrer le frontend : `cd frontend && npm install && npm start`, puis ouvrir http://localhost:4200.

En développement, tous les comptes d’exemple partagent le mot de passe `Demo@1234`, par exemple `alexandre@mdd.dev`.

### Production

Le profil `prod` lit le secret JWT dans la variable d’environnement `JWT_SECRET`. L’application refuse de démarrer sans elle, ce qui évite de livrer une valeur par défaut. Le jeu de données d’exemple n’est actif qu’en profil `dev`.

## Tests

- Backend : `cd backend/mdd && ./mvnw test`.
- Frontend : `cd frontend && npx ng test --watch=false --browsers=ChromeHeadless`.

## Fonctionnalités

- Inscription, connexion, session par JWT, modification du profil.
- Fil personnalisé selon les thèmes suivis, onglets Pour vous, Découvrir et Enregistrés, recherche et filtres par thème.
- Éditeur Markdown avec aperçu en direct, coloration syntaxique pour 16 langages et brouillon conservé automatiquement.
- Mentions utiles, enregistrements, commentaires, temps de lecture annoncé et barre de progression de lecture.
- Section « À lire en ce moment » qui remonte les articles les plus utiles.
- Profils publics avec statistiques et thèmes suivis.
- Thème clair et sombre, navigation au clavier, respect de `prefers-reduced-motion`.
