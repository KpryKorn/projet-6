---
author: noah
subject: Rust
hoursAgo: 340
popularity: 0.35
title: L’opérateur point d’interrogation rend les erreurs Rust lisibles
---
```rust
fn port_from_env() -> Result<u16, Box<dyn std::error::Error>> {
    let raw = std::env::var("PORT")?;
    Ok(raw.parse()?)
}
```

Chaque `?` signifie : si l’opération a échoué, renvoie l’erreur à l’appelant, sinon continue avec la valeur. Cette fonction ne contient aucun `match`, et pourtant elle gère deux sources d’échec différentes, une variable absente et un texte qui n’est pas un nombre.

Pour une application, `Box<dyn Error>` suffit. Pour une bibliothèque, je définis un type d’erreur dédié avec la caisse `thiserror`, afin que les utilisateurs puissent distinguer les cas. Ce qui m’a convaincu, c’est que le chemin d’erreur se lit exactement comme le chemin nominal.
