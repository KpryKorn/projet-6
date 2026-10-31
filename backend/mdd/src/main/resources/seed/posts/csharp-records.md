---
author: amelie_t
subject: C#
hoursAgo: 96
popularity: 0.5
title: Records C# et objets valeur : ne plus écrire Equals à la main
---
```csharp
public sealed record Money(decimal Amount, string Currency)
{
    public Money Add(Money other) =>
        Currency == other.Currency
            ? this with { Amount = Amount + other.Amount }
            : throw new InvalidOperationException("Devises différentes");
}
```

Un `record` fournit l’égalité par valeur, un `ToString` lisible, la déconstruction et l’expression `with`, qui produit une copie modifiée. Deux montants de 10 euros sont égaux sans une ligne de `Equals` ni de `GetHashCode`.

Dans nos modèles de domaine, cela a raccourci les tests : on compare des objets entiers avec `Assert.Equal` au lieu de vérifier chaque propriété une par une. Une réserve tout de même : un `record` qui contient une collection mutable garde l’égalité par référence pour cette collection, donc je préfère `ImmutableArray` dans ce cas.
