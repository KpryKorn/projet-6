import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="page-in container-page max-w-3xl py-12 md:py-16">
      <a
        routerLink="/"
        class="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-(--dur-1) ease-out hover:text-fg"
      >
        <i class="ph ph-arrow-left" aria-hidden="true"></i>
        Retour à l’accueil
      </a>
      <h1 class="mt-6 text-3xl font-semibold text-fg">Mentions légales et confidentialité</h1>

      <div class="md mt-8">
        <h2>Éditeur</h2>
        <p>
          MDD est une plateforme communautaire destinée aux développeurs, éditée à titre non
          commercial.
        </p>

        <h2>Données personnelles</h2>
        <p>
          La plateforme enregistre l’adresse email, le pseudo, la présentation facultative et le mot
          de passe, stocké sous forme hachée. Seuls le pseudo, la présentation et les contenus
          publiés sont visibles par les autres membres. L’adresse email reste privée.
        </p>

        <h2>Cookies et stockage local</h2>
        <p>
          Un cookie technique sécurisé maintient ta session. Ton navigateur conserve aussi le thème
          d’affichage choisi et, le cas échéant, le brouillon d’un article en cours. Aucun traceur
          publicitaire ni outil de mesure d’audience n’est utilisé, ce qui dispense la plateforme
          d’un bandeau de consentement.
        </p>

        <h2>Contact</h2>
        <p>
          Pour toute question relative à tes données ou au fonctionnement de la plateforme, écris à
          contact&#64;mdd.dev.
        </p>
      </div>
    </section>
  `,
})
export class LegalPage {}
