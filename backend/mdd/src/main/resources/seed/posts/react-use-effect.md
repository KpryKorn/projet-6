---
author: hugo_b
subject: React
hoursAgo: 50
popularity: 0.9
title: J’ai supprimé les deux tiers de mes useEffect
---
En relisant un composant de 300 lignes, j’ai compté onze `useEffect`, dont sept servaient seulement à recalculer un état à partir d’un autre. Ce schéma provoque un rendu supplémentaire à chaque changement, ainsi que des bugs de synchronisation difficiles à reproduire.

```tsx
// Avant
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// Après
const fullName = `${first} ${last}`;
```

Une valeur dérivée se calcule pendant le rendu. Pour les actions déclenchées par l’utilisateur, je les place dans le gestionnaire d’événement plutôt que dans un effet qui observe un changement d’état.

Il me reste quatre effets, tous liés au monde extérieur : un abonnement WebSocket, un minuteur, un observateur de taille et le focus d’un champ. C’est à peu près ce que recommande la documentation, et je regrette de ne pas l’avoir relue plus tôt.
