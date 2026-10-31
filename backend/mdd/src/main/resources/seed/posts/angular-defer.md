---
author: camille_r
subject: Angular
hoursAgo: 5
popularity: 0.85
title: Le bloc @defer a divisé mon bundle initial par deux
---
Sur le tableau de bord que je maintiens, le graphique d’activité embarquait une bibliothèque de visualisation de 180 Ko que la moitié des utilisateurs ne voyait jamais, parce qu’elle se trouvait sous la ligne de flottaison. Avec `@defer`, le chargement ne se déclenche plus que lorsque la zone devient visible.

```html
@defer (on viewport) {
  <app-activity-chart [data]="activity()" />
} @placeholder {
  <div class="chart-skeleton" aria-hidden="true"></div>
} @loading (minimum 300ms) {
  <app-spinner />
}
```

Le `@placeholder` réserve la place et évite les sauts de mise en page. Le paramètre `minimum 300ms` du bloc `@loading` empêche un indicateur de clignoter quand le réseau est rapide.

Le gain réel porte sur le bundle initial, passé de 410 Ko à 205 Ko compressés. Mesurez avant et après avec `ng build --stats-json`, car certaines dépendances sont partagées avec d’autres routes et ne bougent pas du tout.
