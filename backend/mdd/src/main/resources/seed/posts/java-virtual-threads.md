---
author: malo
subject: Java
hoursAgo: 14
popularity: 0.75
title: Threads virtuels en production : un an de retour d’expérience
---
Nous avons activé les threads virtuels sur un service Spring Boot qui appelle trois API externes. L’activation tient en une ligne de configuration.

```properties
spring.threads.virtual.enabled=true
```

Le débit a augmenté sur les endpoints qui passent leur temps à attendre, mais le goulot s’est déplacé : le pool de connexions à la base. Rien n’empêche des milliers de threads virtuels d’arriver en même temps devant un pool de vingt connexions Hikari. Nous avons ajouté un `Semaphore` autour des appels les plus coûteux pour réguler l’accès.

Deux pièges nous ont coûté du temps. Un bloc `synchronized` qui contient un appel bloquant épingle le thread porteur sur Java 21, donc nous l’avons remplacé par un `ReentrantLock`. Et nous avons cessé de stocker des valeurs dans des `ThreadLocal`, puisqu’il y en a maintenant autant que de requêtes simultanées.
