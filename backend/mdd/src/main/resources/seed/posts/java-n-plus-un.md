---
author: ravi
subject: Java
hoursAgo: 120
popularity: 0.8
title: Le N+1 de JPA se détecte avec un seul test
---
Le problème des requêtes N+1 passe inaperçu en développement, avec dix lignes en base, et ressort en production avec dix mille. Plutôt que d’espérer le repérer en revue de code, je le fais échouer dans un test qui compte les requêtes.

```java
Statistics stats = sessionFactory.getStatistics();
stats.clear();

List<PostDto> page = postService.listPosts(viewerId, filter, 0, 20).content();

assertThat(stats.getPrepareStatementCount()).isLessThanOrEqualTo(5);
```

Il faut activer `hibernate.generate_statistics=true` dans la configuration de test. Si quelqu’un ajoute un accès paresseux dans un mapper, le compteur passe de 5 à 25 et le test casse avec un message limpide.

Pour corriger, un `@EntityGraph` ou un `join fetch` suffit presque toujours. Le plus important reste d’avoir un garde-fou automatique, parce que personne ne relit chaque mapper à chaque modification.
