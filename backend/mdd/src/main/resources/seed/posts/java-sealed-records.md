---
author: malo
subject: Java
hoursAgo: 300
popularity: 0.55
title: Records et interfaces scellées : modéliser un paiement en Java 21
---
```java
sealed interface Payment permits Card, Transfer, Voucher {}
record Card(String last4, YearMonth expiry) implements Payment {}
record Transfer(String iban) implements Payment {}
record Voucher(String code, int remainingCents) implements Payment {}

String label(Payment payment) {
    return switch (payment) {
        case Card c -> "Carte finissant par " + c.last4();
        case Transfer t -> "Virement vers " + t.iban();
        case Voucher v -> v.remainingCents() + " centimes de crédit";
    };
}
```

Le compilateur vérifie que le `switch` couvre tous les cas, sans clause `default`. Quand on ajoute un `Wallet` à l’interface scellée, chaque `switch` qui l’ignore cesse de compiler, ce qui remplace une série de bugs silencieux par une liste d’erreurs à corriger.

C’est le même confort que celui des types algébriques dans d’autres langages, et il est enfin disponible dans la version de Java que la plupart des équipes utilisent.
