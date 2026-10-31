---
author: sofia_k
subject: Python
hoursAgo: 420
popularity: 0.4
title: Dataclasses avec slots : la mémoire économisée mesurée
---
```python
from dataclasses import dataclass

@dataclass(slots=True, frozen=True)
class Reading:
    sensor_id: int
    value: float
    taken_at: float
```

Avec `slots=True`, Python n’alloue plus de dictionnaire par instance. Sur le chargement de deux millions de relevés, la mémoire résidente de mon processus est passée de 1,1 Go à environ 600 Mo.

La contrepartie est qu’on ne peut plus ajouter d’attribut à la volée, ce que je considère plutôt comme un avantage, et que l’héritage avec des slots demande un peu d’attention. Quant à `frozen=True`, il rend les objets hachables et sûrs à partager entre plusieurs threads. Cette option est disponible depuis Python 3.10.
