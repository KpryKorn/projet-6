---
author: yanis
subject: Go
hoursAgo: 200
popularity: 0.45
title: Tests tabulaires en Go : trois habitudes qui évitent la fragilité
---
```go
tests := []struct {
    name string
    in   string
    want int
}{
    {"chaîne vide", "", 0},
    {"un seul mot", "bonjour", 1},
    {"espaces multiples", "a   b", 2},
}
for _, tc := range tests {
    t.Run(tc.name, func(t *testing.T) {
        t.Parallel()
        if got := CountWords(tc.in); got != tc.want {
            t.Errorf("CountWords(%q) = %d, attendu %d", tc.in, got, tc.want)
        }
    })
}
```

La première habitude consiste à nommer chaque cas avec une phrase qui décrit la situation, plutôt qu’avec un numéro. La deuxième est d’afficher l’entrée dans le message d’erreur, pour comprendre l’échec sans ouvrir le fichier. La troisième est d’appeler `t.Parallel()` dans chaque sous-test.

Depuis Go 1.22, la variable de boucle est propre à chaque itération, donc l’ancien contournement `tc := tc` n’est plus nécessaire.
