---
author: lea_codes
subject: JavaScript
hoursAgo: 270
popularity: 0.5
title: Pourquoi mon setTimeout(0) s’exécute après ma Promise
---
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Affiche : A, D, C, B
```

Le moteur exécute d’abord tout le code synchrone, donc `A` puis `D`. Ensuite, il vide la file des microtâches, où se trouvent les callbacks de promesses, ce qui produit `C`. Seulement après, il passe à la file des macrotâches, où `setTimeout` a placé son callback, même avec un délai de zéro.

Cette différence explique des comportements qui semblent aléatoires, par exemple une mise à jour du DOM qui n’est pas encore visible dans un `.then`, ou une boucle de promesses qui bloque l’affichage. Une chaîne de microtâches qui se relance indéfiniment empêche le navigateur de peindre, alors qu’un `setTimeout` lui laisse la main entre deux passages.
