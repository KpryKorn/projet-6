---
author: yanis
subject: Go
hoursAgo: 30
popularity: 0.65
title: Un appel réseau sans délai maximal est un incident en attente
---
Le client HTTP par défaut de Go n’a aucun délai maximal. Quand un service distant cesse de répondre, votre goroutine, votre connexion et parfois votre utilisateur restent en attente indéfiniment.

```go
ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
defer cancel()

req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
if err != nil {
    return nil, err
}
resp, err := client.Do(req)
```

Partir du contexte de la requête entrante garantit aussi que l’annulation côté client se propage jusqu’aux appels sortants. N’oubliez pas le `defer cancel()` : sans lui, le minuteur reste actif jusqu’à l’expiration, et `go vet` vous le signalera.

Nous avons fixé un délai par dépendance, calculé comme le double du p99 observé. Pendant les pannes de fournisseurs, le nombre de requêtes bloquées sur notre API est tombé à zéro.
