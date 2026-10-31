---
author: ravi
subject: JavaScript
hoursAgo: 150
popularity: 0.9
title: structuredClone remplace enfin JSON.parse(JSON.stringify())
---
Pendant des années, copier un objet en profondeur voulait dire passer par JSON, avec des effets de bord bien connus : les dates devenaient des chaînes, les `Map` et les `Set` disparaissaient, et `undefined` était supprimé sans prévenir.

```js
const original = {
  createdAt: new Date(),
  tags: new Set(['js', 'perf']),
};

const copy = structuredClone(original);
copy.createdAt instanceof Date; // true
copy.tags.has('perf');          // true
```

`structuredClone` gère aussi les références circulaires. Il refuse en revanche les fonctions, avec une erreur `DataCloneError`, et il ne conserve pas les prototypes : une instance de votre classe `User` redevient un objet simple.

Pour un état d’application composé de données pures, il convient très bien. Pour des objets qui portent des méthodes, mieux vaut écrire une fonction de copie explicite.
