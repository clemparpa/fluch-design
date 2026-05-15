# Schéma `DESIGN.md` (format canonique open-design)

Format aligné sur [`nexu-io/open-design`](https://github.com/nexu-io/open-design) et sa source amont [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md). C'est le contrat strict que tout `designs/active.md` et tout seed dans `.claude/skills/apply-theme/library/` doit respecter.

L'objectif : un DESIGN.md écrit par ce skill doit pouvoir être copié verbatim dans le repo open-design (PR contribuant un nouveau design system), et inversement n'importe quel seed open-design doit pouvoir être déposé tel quel dans `library/` sans transformation.

## En-tête de fichier

Toujours dans cet ordre :

```md
# Design System Inspired by <Brand>
> Category: <category>
> <tagline optionnel en une phrase>
```

- **H1** : préfixe « Design System Inspired by » suivi du nom de la marque ou du système. Le picker label affiché à l'user est ce qui suit le préfixe (le sync script open-design strippe « Design System Inspired by »).
- **Blockquote 1 (obligatoire)** : `> Category: <name>`. Vocabulaire suggéré (lenient) : `AI & LLM`, `Developer Tools`, `Productivity`, `Fintech`, `E-Commerce / Mobility`, `Media`, `Automotive`, `Other`, `Starters`. Les seeds réels élargissent parfois (xiaohongshu = `Media & Consumer`) — on tolère toute string descriptive courte.
- **Blockquote 2 (optionnel)** : tagline d'une ligne qui résume la marque (« Lifestyle UGC social platform. Singular brand red, generous radius, content-first. »).

## Les 9 sections (H2 obligatoires, numérotées, ordre strict)

| # | H2 exact | Rôle |
|---|---|---|
| 1 | `## 1. Visual Theme & Atmosphere` | Prose libre : ambiance, philosophie, mood |
| 2 | `## 2. Color Palette & Roles` | Palette structurée par rôle (Primary Brand / Neutrals / Text / Semantic / Dark Mode) |
| 3 | `## 3. Typography Rules` | Stacks, hiérarchie, principes |
| 4 | `## 4. Component Stylings` | Boutons, cards, inputs, formes, radii |
| 5 | `## 5. Layout Principles` | Grilles, containers, density, masonry |
| 6 | `## 6. Depth & Elevation` | Shadows, layering, motion de hover/depth |
| 7 | `## 7. Do's and Don'ts` | Sous-listes `### Do` et `### Don't` |
| 8 | `## 8. Responsive Behavior` | Breakpoints, mobile vs desktop |
| 9 | `## 9. Agent Prompt Guide` | Voice, copy, ton — guide pour un LLM générant du contenu dans cette identité |

**Toutes obligatoires, numérotation incluse.** Le sanity check du skill grep `^## 1\. Visual Theme & Atmosphere$` … `^## 9\. Agent Prompt Guide$` exact match.

## Section 2 — `## 2. Color Palette & Roles` (détail)

Cœur du format. Structurée en sous-sections H3 par **rôle** (pas par token). Le skill mappe ces rôles aux 32 tokens shadcn (cf. [`references/shadcn-tokens.md`](shadcn-tokens.md)).

### Sous-sections H3 conventionnelles

| H3 | Contenu | Présence |
|---|---|---|
| `### Primary Brand` | Couleur(s) de marque, accents, CTAs | obligatoire (au moins 1 puce hex) |
| `### Neutrals` | Surfaces, canvas, fills, separators | obligatoire |
| `### Text` | Title / Paragraph / Description / Disabled | obligatoire |
| `### Semantic` | Success / Warning / Info / Danger | obligatoire (au moins Danger ou mention « réutilise primary ») |
| `### Functional Gradients` | Gradients ponctuels — info-only | optionnel |
| `### Dark Mode` | Overrides pour la version dark | **obligatoire** (le skill refuse de générer du CSS sans) |

### Format des items

Chaque puce :
```md
- **<Name>** (`<value>`): <rôle et usage>.
```

ou avec tiret cadratin :
```md
- **<Name>** (`<value>`) — <rôle et usage>.
```

- `<Name>` = label humain (ex: « Brand Red », « Canvas », « Title »).
- `<value>` = couleur entre backticks. Formats acceptés (mix autorisé dans le même fichier) :
  - hex : `#FF2442`, `#fff`
  - rgba : `rgba(48,48,52,0.05)`
  - OKLCH : `oklch(0.578 0.235 278)`
- Le skill extrait le premier match colorimétrique du contenu entre backticks.

### Exemple verbatim (extrait de `nexu-io/open-design/design-systems/xiaohongshu/DESIGN.md`)

```md
## 2. Color Palette & Roles

### Primary Brand
- **Brand Red — Token** (`#FF2442`): `--primary` and `--color-red`. Use for accents, active tabs, hearts, primary CTAs.
- **Star Yellow** (`#FDBC5F`): bookmark / collect-active icon fill.

### Neutrals (translucent overlay system)
- **Surface** (`#FFFFFF`) — `--bg`. Cards, modals.
- **Canvas** (`#F5F5F5`) — `--bg0`. Page background behind cards.
- **Fill 1** (`rgba(48,48,52,0.05)`) — `--fill1`. Lightest hover, group lines.
- **Separator** (`rgba(0,0,0,0.08)`) — `--separator`. Hairline border.

### Text
- **Title / Primary** (`rgba(0,0,0,0.80)`) — `--title`. Headings and titles.
- **Paragraph / Secondary** (`rgba(0,0,0,0.62)`) — `--paragraph`. Body, secondary text.

### Semantic
- **Success** (`#02B940`) — `--success`.
- **Warning** (`#FF7D03`) — `--warning`.
- **Danger / Error**: no independent token — danger reuses `--primary` (brand red).

### Dark Mode
- **Surface** (`#19191E`) — purple-tinted near-black.
- **Canvas** (`#0E0E11`) — deepest layer.
- **Title** (`rgba(255,255,255,0.84)`).
- **Paragraph** (`rgba(255,255,255,0.56)`).
- **Brand Primary** (`#FF2E4D`) — slight pink shift vs. light mode.
- **Separator** (`rgba(255,255,255,0.07)`).
```

## Mapping vers les tokens shadcn

Au moment de générer `globals.css` (workflow `apply-to-css.md`), le skill parcourt la section 2 et extrait selon ces règles :

### Light scope (tout sauf `### Dark Mode`)

| Shadcn token | Source | Règle |
|---|---|---|
| `--primary` | `### Primary Brand`, première puce | premier hex/rgba/oklch entre backticks |
| `--background` | `### Neutrals`, puce contenant « canvas » / « background » / « page » dans le name | sinon première puce de Neutrals |
| `--card` | `### Neutrals`, puce « Surface » / « Card » | sinon = `--background` |
| `--popover` | `### Neutrals`, puce « Popover » / « Menu » | sinon = `--card` |
| `--foreground` | `### Text`, puce « Title » / « Primary » | sinon première puce de Text |
| `--muted-foreground` | `### Text`, puce « Paragraph » / « Secondary » / « Description » | sinon défaut shadcn |
| `--destructive` | `### Semantic`, puce « Danger » / « Destructive » / « Error » | si prose mentionne « danger reuses primary » → = `--primary` ; sinon défaut shadcn rouge |
| `--border` | `### Neutrals`, puce « Separator » / « Border » | sinon défaut shadcn |
| `--input` | idem `--border` | sinon = `--border` |
| `--ring` | non extrait | défaut shadcn gris neutre |

Tokens optionnels (`--secondary`, `--accent`, `--muted`) : keyword matching dans `### Neutrals` ou défauts shadcn neutral.

Paires `*-foreground` (primary-foreground, destructive-foreground, etc.) : dérivées via [shadcn-tokens.md règle L > 0.65](shadcn-tokens.md) selon le L OKLCH du token de base.

### Dark scope (uniquement `### Dark Mode`)

Mêmes règles, appliquées **dans le sous-bloc `### Dark Mode` exclusivement**. Si une puce manque côté dark, fallback aux défauts shadcn dark — **jamais** dérivation depuis light (évite les dark modes incohérents).

### Tokens charts / sidebar

Pas extraits depuis DESIGN.md en v1. Toujours émis avec les défauts shadcn (cf. [shadcn-tokens.md §2 et §3](shadcn-tokens.md)). Une section 2 enrichie pourra les couvrir en v2 (sous-headings `### Charts` / `### Sidebar`).

## Section 3 — `## 3. Typography Rules`

Prose + tableaux. Au minimum, mentionner :
- **Font Family** (sans / mono / heading / display, stacks complets ou nom de la famille principale)
- **Hiérarchie** (tableau optionnel : token H1/H2/.../body avec size, weight, line-height)
- **Principes** (poids permis, tracking, soft black vs pur black, etc.)

Le skill extrait `--font-sans`, `--font-mono`, `--font-heading` du sous-bloc Font Family (recherche les premiers stacks crédibles). Si absent → défauts skill (cf. [shadcn-tokens.md §4](shadcn-tokens.md)).

## Section 4 — `## 4. Component Stylings`

Prose + sous-blocs `### Buttons`, `### Cards`, `### Inputs`, etc. Le skill extrait :
- `--radius` : depuis une mention `border-radius: 12px` ou `Radius: 0.5rem` dans `### Buttons` ou `### Cards`. Si plusieurs valeurs présentes (cards 12px, buttons pill), prendre la valeur de Cards comme représentative. Défaut `0.625rem`.
- Indicateurs de motion (transitions) : éventuellement parsés ici (« hover transitions 200ms ») pour émettre `--duration-base` dans `@theme`. Optionnel.

## Section 5 — `## 5. Layout Principles`

Prose. Décrit grilles, containers, density (compact/aéré), masonry, etc. **Pas d'émission CSS directe** — informatif pour l'agent qui designera ensuite des pages.

## Section 6 — `## 6. Depth & Elevation`

Prose + tableau de niveaux (Flat / Subtle / Modal etc.) ou liste de shadows. Le skill peut éventuellement extraire un ou deux box-shadows pour émettre des `--shadow-*` custom dans `@theme`. En v1 : informatif uniquement, pas d'émission.

## Section 7 — `## 7. Do's and Don'ts`

Sous-listes obligatoires :
```md
## 7. Do's and Don'ts

### Do
- ✅ <règle positive>
- ✅ <règle positive>

### Don't
- ❌ <anti-pattern>
- ❌ <anti-pattern>
```

Le `### Don't` est utilisé par [workflows/refine.md](../workflows/refine.md) pour bloquer une modif user qui contredirait un anti-pattern explicite. Pas d'émission CSS.

## Section 8 — `## 8. Responsive Behavior`

Prose + breakpoints. Mentionner les breakpoints custom (`--breakpoint-3xl: 1600px` etc.) si différents de Tailwind v4. Informatif en v1.

## Section 9 — `## 9. Agent Prompt Guide`

Prose. Voice, ton, guide pour un LLM générant du contenu de marque. Le skill en extrait une phrase résumée et l'émet en commentaire d'en-tête `/* Voice: ... */` de `globals.css`.

## Sanity checks (appliqués par `apply-to-css.md` STEP 1.5)

1. H1 commence par `# ` (le préfixe « Design System Inspired by » est suggéré mais non strictement enforced).
2. `> Category:` présent en ligne 2.
3. Les 9 H2 numérotés exacts présents, ordre strict.
4. Section 2 contient `### Primary Brand` (ou variante « Primary », « Brand ») **et** `### Dark Mode`.
5. Au moins 1 valeur colorimétrique entre backticks dans `### Primary Brand`.
6. Au moins 4 valeurs colorimétriques entre backticks dans `### Dark Mode`.

Échec (4)/(5)/(6) → refus dark, message standard du skill.

## Worked example complet — Stripe-inspired

```md
# Design System Inspired by Stripe
> Category: Fintech
> Confiance institutionnelle, lisibilité maximale, espace généreux.

## 1. Visual Theme & Atmosphere
Stripe construit une identité de calme institutionnel : tout dit « cette plateforme tient la route ». Le canevas blanc est généreux, la couleur de marque (blurple `#635bff`) intervient en accent rare — boutons, liens, focus rings — jamais en arrière-plan. Les paragraphes respirent, les cards posent à plat sans relief flashy, les hairlines sont fines (`#e6ebf1`). Pas de gradient publicitaire, pas de glassmorphism : la lisibilité prime.

Type sans serif moderne (Inter ou équivalent), hiérarchie compacte mais aérée, weight 500–600 pour les headings, body en 400. Les états destructive existent (`#df1b41`) mais restent discrets sauf en cas réel d'erreur.

Le résultat lit comme un dashboard fintech adulte : sérieux sans austérité, technique sans jargon. Densité d'info élevée mais perception calme.

## 2. Color Palette & Roles

### Primary Brand
- **Stripe Blurple** (`#635bff`): primary CTA, links, active states, focus rings.

### Neutrals
- **Surface** (`#ffffff`): card backgrounds, modal backgrounds.
- **Canvas** (`#f6f9fc`): page background, sections background.
- **Border** (`#e6ebf1`): hairlines, separators, input borders.
- **Fill Hover** (`#f6f9fc`): subtle hover surface on neutral elements.

### Text
- **Title** (`#0a2540`): headings, primary labels.
- **Paragraph** (`#425466`): body text.
- **Description** (`#697386`): captions, helper text, secondary info.

### Semantic
- **Success** (`#16a34a`).
- **Warning** (`#f59e0b`).
- **Info** (`#0ea5e9`).
- **Danger** (`#df1b41`): destructive actions, error states.

### Dark Mode
- **Canvas** (`#0a2540`): page bg dark, deepest layer.
- **Surface** (`#0e2a4a`): card / modal bg, slight L lift vs canvas.
- **Title** (`#f6f9fc`): headings.
- **Paragraph** (`#a3acba`): body.
- **Brand Primary** (`#a5a5ff`): shift plus clair pour conserver lisibilité sur fond foncé.
- **Danger** (`#ff5d76`): version dark plus chaude.
- **Border** (`rgba(255,255,255,0.10)`): hairlines alpha sur dark.
- **Input** (`rgba(255,255,255,0.15)`): bordures inputs alpha.

## 3. Typography Rules

### Font Family

Stack principal :
```
Inter, system-ui, -apple-system, 'Helvetica Neue', sans-serif
```

Mono (code samples, API keys) :
```
'JetBrains Mono', ui-monospace, SFMono-Regular, monospace
```

Heading reprend `sans` sans variante display.

### Hiérarchie

| Token | Size | Weight | Line-height |
|---|---|---|---|
| H1 | 32px | 600 | 40px |
| H2 | 24px | 600 | 32px |
| H3 | 20px | 600 | 28px |
| Body | 16px | 400 | 24px |
| Small | 14px | 400 | 20px |
| Caption | 12px | 400 | 16px |

### Principes
- Trois weights seulement : 400 / 500 / 600. Pas de thin/light, pas de 800.
- Tracking 0 sur les body, -0.01em sur les headings ≥ 24px.
- Soft black `#0a2540` pour les titles (pas pur `#000`).

## 4. Component Stylings

### Buttons
- Primary : bg `#635bff`, text `#ffffff`, weight 500, radius `0.375rem`, padding `8px 16px` (small) / `12px 24px` (large).
- Secondary : bg `#ffffff`, border `1px solid #e6ebf1`, text `#0a2540`.
- Ghost : bg transparent, text `#635bff`.
- Destructive : bg `#df1b41`, text `#ffffff`.

### Cards
- Background `#ffffff` (light) / `#0e2a4a` (dark).
- Radius `0.375rem`.
- Border `1px solid #e6ebf1` (light) / `rgba(255,255,255,0.10)` (dark).
- Pas de shadow en état rest. Subtle shadow sur hover sur PC uniquement.

### Inputs
- Background même que canvas.
- Border `1px solid #e6ebf1`.
- Focus ring : 2px blurple à 25% opacité.

## 5. Layout Principles

- Container max width : `1152px` (équivalent `max-w-6xl`).
- Grille 12 colonnes, gutter `24px`.
- Hero centré large, sections espacées de `96px` minimum sur desktop.
- Cards posées à plat, alignement strict en grille, jamais de masonry.
- Density : confortable. Pas de dashboards ultra-denses type SaaS console.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat (0) | Aucun shadow | Cards en rest, sections, headers |
| Subtle (1) | `0 1px 3px rgba(0,0,0,0.06)` | Cards en hover PC light mode |
| Modal (2) | `0 12px 32px rgba(0,0,0,0.12)` | Modals, popovers |

Motion : transitions `cubic-bezier(0.4, 0, 0.2, 1)` durée 150–200ms sur les hover. Pas d'animation entry/exit lourde.

Dark mode : drop shadows remplacés par hairline `rgba(255,255,255,0.08)` (les shadows alpha-noir sont invisibles sur dark).

## 7. Do's and Don'ts

### Do
- ✅ Espace généreux entre sections (96px+).
- ✅ Couleur de marque rare pour qu'elle reste perçue comme accent.
- ✅ Soft black `#0a2540` pour les titles.
- ✅ Hairlines fines, pas de borders épaisses.

### Don't
- ❌ Pas de gradient flashy en background.
- ❌ Pas de glassmorphism / blur effects.
- ❌ Pas de shadows lourdes en rest state.
- ❌ Pas de pur `#000` pour le texte.

## 8. Responsive Behavior

- Mobile-first via Tailwind défauts (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536).
- Container `max-w-6xl` desktop, edge-to-edge avec padding 16px en mobile.
- Hero stack vertical sur mobile, horizontal à partir de `md`.
- Navigation desktop horizontale, drawer côté droit en mobile.

## 9. Agent Prompt Guide

Voice : direct, technique mais accessible. Pas de jargon corporate, pas de marketing fluff. Phrases courtes, sujet + verbe + complément. Au moment d'écrire de la copie pour ce DS, préférer la deuxième personne pour les CTAs (« Get started », « Connect your account »), factuel pour les descriptions de feature (« Subscriptions handle recurring payments » plutôt que « Empower your business with seamless recurring revenue »). Éviter les superlatifs (« best », « ultimate »). Quand on parle technique, citer du code dans `monospace` plutôt que paraphraser. Ton confiance tranquille, jamais hype.
```

Le `globals.css` émis depuis ce DESIGN.md doit reproduire le worked example de [`references/css-mapping.md`](css-mapping.md) (avec les ajouts chart/sidebar/breakpoints de la Tâche 1).
