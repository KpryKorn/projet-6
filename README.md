# Monde de Devs - réseau social pour développeurs

## Architecture

### Frontend

- Angular 20
- NgRx pour la gestion d'état globale
- Angular Signals pour la gestion d'état locale
- PrimeNG pour les composants UI
- RxJS pour la programmation réactive

#### State Management

> Cette application utilise une combinaison de NgRx et d'Angular Signals pour la gestion de l'état :
> [voir plus ici](https://angular.fr/ngrx/signals/usage.html#architecture-recommandee)
>
> - **NgRx** est utilisé pour gérer l'état global de l'application, comme les fonctionnalités d'authentification. Cela permet une gestion centralisée et prévisible de l'état (`core/store`) via des signaux
> - Les **Angular Signals** sont utilisés pour gérer l'état local, comme les informations de l'utilisateur connecté, ou celles d'un formulaire. Cela permet une gestion plus réactive et performante de l'état local sans la surcharge de NgRx

### Backend

- Java Spring Boot
- Spring Security avec JWT pour l'authentification
- Hibernate/JPA pour la gestion de la base de données
- Base de données PostgreSQL

## Installation

1. Cloner le dépôt
2. Installer les dépendances frontend avec `cd frontend && npm install`
3. Installer l'application backend avec `cd backend && mvn install`

## Configuration

Configurer les variables d'environnement

```bash
cd infra && cp .env.example .env
```

et modifier `.env` pour votre application

## Lancement

1. Démarrer la base de données PostgreSQL avec Docker : `docker compose up -d`
2. Démarrer le backend : `cd backend && mvn spring-boot:run`
3. Démarrer le frontend : `cd frontend && npm run start`
4. Accéder à l'application via http://localhost:4200
