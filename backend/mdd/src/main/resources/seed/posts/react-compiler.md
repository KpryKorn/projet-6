---
author: lea_codes
subject: React
hoursAgo: 230
popularity: 0.6
title: React Compiler en équipe : ce que nous avons mesuré avant de l’activer
---
Avant d’activer le compilateur sur toute la base de code, nous l’avons lancé en mode d’annotation, composant par composant, en mesurant le temps de rendu dans le profileur sur trois écrans connus pour être lents.

Sur la liste de factures, le nombre de rendus inutiles est passé de 41 à 6 sans toucher au code. Sur les deux autres écrans, nous n’avons constaté aucune différence visible. Ces chiffres nous ont convaincus de ne pas supprimer en masse nos `useMemo` et nos `useCallback`, une opération sans intérêt tant que le compilateur n’était pas généralisé.

La règle ESLint fournie avec l’outil a en revanche remonté une douzaine de composants qui modifiaient leurs props. Ces bugs existaient déjà et personne ne les avait vus. Rien que pour cela, l’expérience valait le coup.
