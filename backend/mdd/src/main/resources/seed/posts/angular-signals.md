---
author: camille_r
subject: Angular
hoursAgo: 380
popularity: 0.7
title: Remplacer un BehaviorSubject par un signal, étape par étape
---
```ts
// Avant
private readonly count$ = new BehaviorSubject(0);
readonly doubled$ = this.count$.pipe(map((n) => n * 2));

// Après
readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);
```

Pour de l’état synchrone, un signal est plus simple qu’un `BehaviorSubject` : on lit la valeur en appelant la fonction, on n’a pas besoin du pipe `async` et il n’y a aucun abonnement à fermer.

J’applique la migration dans cet ordre. D’abord les services qui n’exposent qu’une valeur courante, ensuite les composants qui les consomment, enfin les flux qui combinent plusieurs sources avec `combineLatest`. Pour ces derniers, je garde RxJS tant qu’il y a du temps, des requêtes ou de l’annulation en jeu, et j’utilise `toSignal` à la frontière avec le template.
