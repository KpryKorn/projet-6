import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { OrbitComponent } from '@components/orbit/orbit.component';
import { SubjectBadgeComponent } from '@components/subject-badge/subject-badge.component';
import { RevealDirective } from '@directives/reveal.directive';
import { TaglineRevealComponent } from '../components/tagline-reveal.component';

@Component({
  selector: 'app-landing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RevealDirective,
    TaglineRevealComponent,
    AvatarComponent,
    OrbitComponent,
    SubjectBadgeComponent,
  ],
  template: `
    <!-- Hero -->
    <div class="hero-halo relative overflow-hidden">
      <div class="dot-grid pointer-events-none absolute inset-0" aria-hidden="true"></div>
      <section
        class="relative mx-auto w-full max-w-6xl px-4 pt-16 pb-20 md:px-6 md:pt-24"
        aria-labelledby="hero-title"
      >
        <div class="grid items-center gap-12 xl:grid-cols-[1fr_22rem]">
          <div class="page-in flex flex-col items-start gap-6">
            <p class="chip bg-surface px-3 font-mono text-xs">
              Des devs qui partagent ce qu’ils apprennent
            </p>
            <h1
              id="hero-title"
              class="max-w-[680px] text-[40px] leading-[44px] font-semibold tracking-[-0.035em] text-fg md:text-5xl md:leading-[52px] xl:text-[56px] xl:leading-[60px]"
            >
              <span class="block">Apprends de devs</span>
              <span class="block">qui partagent ce qu’ils</span>
              <span class="block"
                >ont vraiment construit<span class="caret" aria-hidden="true"></span
              ></span>
            </h1>
            <p class="max-w-[680px] text-lg text-muted md:text-xl">
              MDD, c’est un endroit pour lire des retours d’expérience sur les langages et les
              outils que tu utilises, poser tes questions et publier ce que tu as fini par
              comprendre.
            </p>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a routerLink="/register" class="btn btn-primary btn-lg">
                Créer mon compte
                <i class="ph-bold ph-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
            <ul class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-subtle">
              <li class="flex items-center gap-2">
                <i class="ph-fill ph-check-circle text-success" aria-hidden="true"></i>
                Gratuit, sans carte bancaire
              </li>
              <li class="flex items-center gap-2">
                <i class="ph-fill ph-check-circle text-success" aria-hidden="true"></i>
                Un temps de lecture sur chaque article
              </li>
              <li class="flex items-center gap-2">
                <i class="ph-fill ph-check-circle text-success" aria-hidden="true"></i>
                Pas de pub
              </li>
            </ul>
          </div>

          <!-- Orbit with a sample article -->
          <div class="relative mx-auto hidden w-full max-w-88 xl:block" aria-hidden="true">
            <app-orbit />
            <div
              class="card absolute top-1/2 right-0 left-0 flex -translate-y-1/2 flex-col gap-2 p-4 shadow-md"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-2 text-sm font-medium text-fg">
                  <app-avatar username="camille_r" size="sm" />
                  camille_r
                </span>
                <app-subject-badge title="Angular" />
              </div>
              <p class="text-base font-semibold text-fg">
                Le bloc &#64;defer a divisé mon bundle par deux
              </p>
              <p class="flex items-center gap-3 font-mono text-[13px] text-subtle tabular-nums">
                <span class="flex items-center gap-1 text-accent-text"
                  ><i class="ph-fill ph-thumbs-up"></i> 47</span
                >
                <span>3 min</span>
              </p>
            </div>
            <div class="chip absolute right-0 bottom-6 bg-surface px-3 font-mono shadow-sm">
              Un fil construit à partir de tes thèmes
            </div>
          </div>
        </div>

        <!-- Product preview -->
        <div appReveal class="mt-16 md:mt-20" aria-hidden="true">
          <div class="overflow-hidden rounded-xl border border-line bg-surface shadow-md">
            <div class="flex h-10 items-center border-b border-line px-4">
              <span class="font-mono text-xs text-subtle">mdd.dev/feed</span>
            </div>
            <div class="grid gap-4 p-4 md:grid-cols-[1fr_16rem] md:p-6">
              <div class="flex flex-col gap-4">
                <div class="rounded-lg border border-line bg-surface p-4">
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2 text-sm text-muted">
                      <app-avatar username="marion_leroux" size="sm" />
                      <span class="font-medium text-fg">marion_leroux</span>
                    </span>
                    <app-subject-badge title="Angular" />
                  </div>
                  <p class="mt-3 text-lg font-semibold text-fg">
                    Pourquoi j’ai retiré la moitié de mes effets de bord après le passage aux
                    signaux
                  </p>
                  <p class="mt-1 text-base text-muted">
                    Trois composants réécrits, un bug de synchronisation en moins et des tests qui
                    tiennent enfin sur une page.
                  </p>
                  <div
                    class="mt-3 flex items-center gap-4 font-mono text-[13px] text-subtle tabular-nums"
                  >
                    <span class="flex items-center gap-1 text-accent-text">
                      <i class="ph-fill ph-thumbs-up" aria-hidden="true"></i>
                      47
                    </span>
                    <span class="flex items-center gap-1">
                      <i class="ph ph-chat-circle" aria-hidden="true"></i>
                      12
                    </span>
                    <span>6 min</span>
                  </div>
                </div>
                <div class="rounded-lg border border-line bg-surface p-4">
                  <div class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2 text-sm text-muted">
                      <app-avatar username="theo_garnier" size="sm" />
                      <span class="font-medium text-fg">theo_garnier</span>
                    </span>
                    <app-subject-badge title="Rust" />
                  </div>
                  <p class="mt-3 text-lg font-semibold text-fg">
                    Écrire un parseur de logs sans allocation inutile
                  </p>
                  <p class="mt-1 text-base text-muted">
                    Les emprunts expliqués avec un exemple qui traite 2,4 millions de lignes par
                    seconde.
                  </p>
                </div>
              </div>
              <div
                class="hidden flex-col gap-3 self-start rounded-lg border border-line bg-surface-2 p-5 md:flex"
              >
                <p class="flex items-center gap-2 text-sm font-semibold text-fg">
                  <i class="ph-fill ph-fire" aria-hidden="true"></i>
                  À lire en ce moment
                </p>
                <p class="flex gap-3 text-sm text-fg">
                  <span class="font-mono text-subtle">01</span> Les records Java 21 en production
                </p>
                <p class="flex gap-3 text-sm text-fg">
                  <span class="font-mono text-subtle">02</span> Docker en plusieurs étapes, sans la
                  magie
                </p>
                <p class="flex gap-3 text-sm text-fg">
                  <span class="font-mono text-subtle">03</span> Tester une API avec Testcontainers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Benefits -->
    <section class="container-page py-24 md:py-32" aria-labelledby="benefits-title">
      <div appReveal class="max-w-[680px]">
        <p class="eyebrow"><span class="text-accent-text">01</span> / Ce que tu y gagnes</p>
        <h2
          id="benefits-title"
          class="mt-2 text-[28px] leading-[34px] font-semibold text-fg md:text-[40px] md:leading-[46px]"
        >
          Ce que tu trouveras sur MDD
        </h2>
        <p class="mt-4 text-lg text-muted">
          Des articles écrits par des devs, un fil limité à tes thèmes et des commentaires pour
          poser tes questions.
        </p>
      </div>

      <ul class="mt-12 grid gap-4 md:grid-cols-6">
        @for (item of benefits; track item.title; let i = $index) {
          <li
            appReveal
            [revealDelay]="i * 50"
            class="card relative flex flex-col gap-3 p-6"
            [class]="item.span"
          >
            <span class="icon-tile">
              <i [class]="item.icon + ' text-xl'" aria-hidden="true"></i>
            </span>
            <span class="absolute top-6 right-6 font-mono text-xs text-subtle" aria-hidden="true"
              >0{{ i + 1 }}</span
            >
            <h3 class="text-lg font-semibold text-fg">{{ item.title }}</h3>
            <p class="text-base text-muted">{{ item.text }}</p>
          </li>
        }
      </ul>
    </section>

    <!-- Tagline reveal -->
    <section
      class="relative border-y border-line bg-surface"
      aria-label="Pourquoi partager ce que tu apprends"
    >
      <div class="dot-grid pointer-events-none absolute inset-0" aria-hidden="true"></div>
      <div class="container-page relative py-24">
        <app-tagline-reveal
          class="block"
          text="Ce que tu as appris cette semaine peut faire gagner une journée à quelqu’un d’autre. Partage-le avant de l’oublier."
        />
      </div>
    </section>

    <!-- How it works -->
    <section class="container-page py-24 md:py-32" aria-labelledby="how-title">
      <div appReveal class="max-w-[680px]">
        <p class="eyebrow"><span class="text-accent-text">02</span> / Comment ça marche</p>
        <h2
          id="how-title"
          class="mt-2 text-[28px] leading-[34px] font-semibold text-fg md:text-[40px] md:leading-[46px]"
        >
          Trois étapes, de l’inscription au premier article
        </h2>
      </div>
      <ol class="relative mt-12 grid gap-4 md:grid-cols-3">
        <span
          class="pointer-events-none absolute top-[3.25rem] right-6 left-6 hidden border-t border-dashed border-line-strong md:block"
          aria-hidden="true"
        ></span>
        @for (step of steps; track step.title; let i = $index) {
          <li appReveal [revealDelay]="i * 60" class="card relative flex flex-col gap-3 p-6">
            <span
              class="flex size-8 items-center justify-center rounded-sm border border-line-strong bg-surface font-mono text-sm text-accent-text"
              >0{{ i + 1 }}</span
            >
            <h3 class="mt-2 text-lg font-semibold text-fg">{{ step.title }}</h3>
            <p class="text-base text-muted">{{ step.text }}</p>
          </li>
        }
      </ol>
    </section>

    <!-- Proof: a rendered article -->
    <section class="container-page py-24 md:py-32" aria-labelledby="proof-title">
      <div class="grid items-center gap-12 md:grid-cols-2">
        <div appReveal>
          <p class="eyebrow"><span class="text-accent-text">03</span> / Lecture et écriture</p>
          <h2
            id="proof-title"
            class="mt-2 text-[28px] leading-[34px] font-semibold text-fg md:text-[40px] md:leading-[46px]"
          >
            Du code qui se lit bien, dans le fil comme dans l’éditeur
          </h2>
          <p class="mt-4 text-lg text-muted">
            Le Markdown est rendu avec une coloration syntaxique pour 16 langages. L’aperçu en
            direct te montre le résultat avant de publier, et ton brouillon reste sur ton appareil
            si tu fermes l’onglet.
          </p>
        </div>
        <div appReveal [revealDelay]="120" class="card overflow-hidden" aria-hidden="true">
          <div
            class="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-subtle"
          >
            <span>article.md</span>
            <span class="flex items-center gap-1"><i class="ph ph-eye"></i> Aperçu</span>
          </div>
          <div class="flex font-mono text-[13.5px] leading-[22px]">
            <div class="w-8 shrink-0 border-r border-line py-4 text-right text-subtle select-none">
              <div class="pr-2">1</div>
              <div class="pr-2">2</div>
              <div class="pr-2">3</div>
              <div class="pr-2">4</div>
              <div class="pr-2">5</div>
              <div class="pr-2">6</div>
            </div>
            <pre
              class="min-w-0 flex-1 overflow-x-auto p-4"
            ><code><span class="hljs-keyword">const</span> feed = <span class="hljs-title">computed</span>(() =&gt; &#123;
  <span class="hljs-keyword">return</span> posts().<span class="hljs-title">filter</span>(post =&gt;
    followed().<span class="hljs-title">has</span>(post.subject.id)
  );
&#125;);
<span class="hljs-comment">// Un seul calcul, mis à jour tout seul</span></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="container-page py-24 md:py-32" aria-labelledby="faq-title">
      <div class="mx-auto max-w-3xl">
        <div appReveal>
          <p class="eyebrow"><span class="text-accent-text">04</span> / Questions fréquentes</p>
          <h2
            id="faq-title"
            class="mt-2 text-[28px] leading-[34px] font-semibold text-fg md:text-[40px] md:leading-[46px]"
          >
            Tes questions avant de t’inscrire
          </h2>
        </div>
        <div class="mt-12 divide-y divide-line border-y border-line">
          @for (item of faq; track item.question; let i = $index) {
            <details appReveal [revealDelay]="i * 40" class="group py-5">
              <summary
                class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-fg"
              >
                {{ item.question }}
                <i
                  class="ph ph-plus shrink-0 text-subtle transition-transform duration-(--dur-2) ease-out group-open:rotate-45"
                  aria-hidden="true"
                ></i>
              </summary>
              <p class="mt-3 text-base text-muted">{{ item.answer }}</p>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- Risk reversal and final CTA -->
    <section class="container-page pb-16 md:pb-24" aria-labelledby="cta-title">
      <div
        appReveal
        class="relative flex flex-col items-start gap-6 overflow-hidden rounded-xl border border-(--inverse-border) bg-inverse-bg p-8 text-inverse-fg md:p-16"
      >
        <span
          class="pointer-events-none absolute -right-24 -bottom-24 size-[28rem] rounded-full border border-white/12"
          aria-hidden="true"
        ></span>
        <app-orbit
          class="pointer-events-none absolute top-1/2 right-12 hidden w-80 -translate-y-1/2 opacity-50 xl:block"
        />
        <h2 id="cta-title" class="relative max-w-[680px] text-3xl font-semibold md:text-5xl">
          Ton prochain article peut en débloquer un autre
        </h2>
        <p class="relative max-w-[680px] text-lg text-inverse-fg/75">
          L’inscription est gratuite. Tes articles restent les tiens : tu peux les modifier ou les
          supprimer quand tu veux.
        </p>
        <a routerLink="/register" class="btn btn-primary btn-lg relative">
          Créer mon compte
          <i class="ph-bold ph-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </section>
  `,
})
export class LandingPage {
  protected readonly benefits = [
    {
      icon: 'ph ph-funnel',
      title: 'Un fil qui parle ton langage',
      text: 'Tu suis Java, Angular ou Rust, et le fil ne te montre que ces thèmes. L’onglet Découvrir sert à élargir tes lectures.',
      span: 'md:col-span-4',
    },
    {
      icon: 'ph ph-clock',
      title: 'Un temps de lecture annoncé',
      text: 'Chaque article indique sa durée avant que tu l’ouvres, pour choisir ce qui tient dans ta pause.',
      span: 'md:col-span-2',
    },
    {
      icon: 'ph ph-code',
      title: 'Du code lisible',
      text: 'Le Markdown est coloré pour 16 langages, avec un aperçu en direct dans l’éditeur.',
      span: 'md:col-span-2',
    },
    {
      icon: 'ph ph-thumbs-up',
      title: 'Les articles utiles remontent',
      text: 'La mention utile et l’enregistrement dans ta liste font remonter les articles qui ont vraiment aidé quelqu’un.',
      span: 'md:col-span-2',
    },
    {
      icon: 'ph ph-chats-circle',
      title: 'Une discussion qui avance',
      text: 'Pose ta question sous l’article. L’auteur et les autres lecteurs te répondent dans les commentaires.',
      span: 'md:col-span-2',
    },
  ];

  protected readonly steps = [
    {
      title: 'Choisis tes thèmes',
      text: 'Sélectionne les langages et les outils qui t’intéressent. Tu peux en changer à tout moment depuis ton profil.',
    },
    {
      title: 'Lis et réagis',
      text: 'Marque les articles utiles, commente et enregistre ceux que tu veux relire plus tard.',
    },
    {
      title: 'Publie ton retour d’expérience',
      text: 'Écris en Markdown, vérifie l’aperçu et publie. Ton brouillon est conservé automatiquement.',
    },
  ];

  protected readonly faq = [
    {
      question: 'Combien coûte MDD ?',
      answer:
        'MDD est gratuit : créer un compte, lire, commenter et publier ne demandent aucun paiement.',
    },
    {
      question: 'Qu’est-ce que je peux publier ?',
      answer:
        'Des articles techniques en Markdown, jusqu’à 20 000 caractères, rattachés à un thème. Les blocs de code sont colorés pour 16 langages.',
    },
    {
      question: 'Comment fonctionne le fil Pour toi ?',
      answer:
        'Il affiche les articles des thèmes que tu suis, du plus récent au plus ancien. L’onglet Découvrir montre tous les articles de la plateforme.',
    },
    {
      question: 'Comment modifier ou supprimer un article ?',
      answer:
        'Depuis la page de l’article, quand tu veux. La suppression retire aussi les commentaires associés.',
    },
    {
      question: 'Quelles informations sont visibles par les autres ?',
      answer:
        'Ton pseudo, ta présentation, tes articles et tes commentaires. Ton adresse email reste privée.',
    },
  ];
}
