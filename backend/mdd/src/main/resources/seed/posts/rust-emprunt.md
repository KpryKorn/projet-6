---
author: noah
subject: Rust
hoursAgo: 20
popularity: 0.6
title: Comprendre l’emprunt en Rust en le dessinant
---
Pendant mes premières semaines de Rust, je lisais les messages du compilateur sans comprendre ce qu’il me reprochait. Ce qui a tout débloqué, c’est de dessiner les durées de vie sur papier, avec un trait par référence.

La règle tient en une phrase : à un instant donné, une valeur a soit plusieurs références partagées, soit une seule référence mutable, jamais les deux.

```rust
let mut notes = vec![String::from("lire")];
let premiere = &notes[0];                  // emprunt partagé
notes.push(String::from("écrire"));        // erreur : emprunt mutable
println!("{premiere}");
```

Le compilateur refuse parce que `push` peut réallouer le tableau, ce qui laisserait `premiere` pointer vers une mémoire libérée. Sur le dessin, le trait de `premiere` traverse le `push`, et cela saute aux yeux. Afficher la valeur avant le `push` règle le problème, et c’est exactement ce que Rust voulait m’apprendre sur mon propre code.
