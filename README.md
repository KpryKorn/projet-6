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
>
> - **NgRx** est utilisé pour gérer l'état global de l'application, comme les fonctionnalités d'authentification. Cela permet une gestion centralisée et prévisible de l'état (`core/store/auth`) via des actions, des reducers et des effets
> - Les **Angular Signals** sont utilisés pour gérer l'état local, comme les informations de l'utilisateur connecté, ou celles d'un formulaire. Cela permet une gestion plus réactive et performante de l'état local sans la surcharge de NgRx (`core/services/stateful/user`)

### Backend

- Java Spring Boot
