---
author: hugo_b
subject: Vue.js
hoursAgo: 75
popularity: 0.4
title: Des composables Vue qui se testent sans monter de composant
---
Un composable qui ne dépend ni du DOM ni du cycle de vie d’un composant se teste comme une simple fonction. Voici un compteur de tentatives avec délai croissant, que j’utilise pour relancer des appels réseau.

```ts
export function useRetry(max = 3) {
  const attempts = ref(0);
  const canRetry = computed(() => attempts.value < max);
  const delay = computed(() => 2 ** attempts.value * 250);

  function fail() {
    attempts.value++;
  }

  return { attempts, canRetry, delay, fail };
}
```

Le test appelle `fail()` deux fois et vérifie que `delay.value` vaut 1000. Il n’y a aucun `mount` et aucun `await nextTick`.

Quand un composable a besoin de `onMounted`, je le sépare en deux parties : une fonction pure qui contient la logique, et une fine enveloppe qui la branche sur le cycle de vie du composant.
