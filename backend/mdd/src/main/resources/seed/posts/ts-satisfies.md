---
author: ines_dev
subject: TypeScript
hoursAgo: 9
popularity: 0.7
title: L’opérateur satisfies a remplacé la moitié de mes assertions de type
---
Pendant longtemps, j’écrivais `as const` ou `as Config` pour faire taire le compilateur, et je perdais au passage des informations utiles. `satisfies` vérifie qu’une valeur respecte un type sans élargir ce que TypeScript a déduit.

```ts
type Route = { path: string; auth: boolean };

const routes = {
  home: { path: '/', auth: false },
  profile: { path: '/profile', auth: true },
} satisfies Record<string, Route>;

routes.profile.path; // "/profile"
routes.settings;     // erreur : cette clé n'existe pas
```

Avec une annotation `: Record<string, Route>`, la dernière ligne compilerait, puisque n’importe quelle clé serait acceptée. Avec `satisfies`, on garde les clés exactes tout en vérifiant la forme de chaque entrée. Je l’utilise désormais pour les tables de configuration, les routes et les dictionnaires de traductions.
