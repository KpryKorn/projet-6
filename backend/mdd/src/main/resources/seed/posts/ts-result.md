---
author: ines_dev
subject: TypeScript
hoursAgo: 170
popularity: 0.55
title: Typer ses erreurs attendues avec un type Result
---
```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parsePort(input: string): Result<number, 'not_a_number' | 'out_of_range'> {
  const port = Number(input);
  if (Number.isNaN(port)) return { ok: false, error: 'not_a_number' };
  if (port < 1 || port > 65535) return { ok: false, error: 'out_of_range' };
  return { ok: true, value: port };
}
```

Les exceptions ne figurent pas dans la signature d’une fonction TypeScript, donc rien n’oblige l’appelant à les traiter. Un `Result` rend l’échec visible dans le type, et le compilateur vérifie que chaque cas est géré dès qu’on écrit un `switch` sur `error`.

Je réserve les exceptions aux situations vraiment inattendues, comme une base de données injoignable. Pour ce qui fait partie du fonctionnement normal, par exemple une saisie invalide, une ressource absente ou un droit refusé, j’utilise `Result`.
