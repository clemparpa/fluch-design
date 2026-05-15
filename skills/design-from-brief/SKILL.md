---
name: design-from-brief
description: |
  Génère un `designs/active.md` from scratch depuis un brief user (langage
  naturel ou I-Lang structuré). Résout 8 dimensions orthogonales (palette,
  accent, typo, display, layout, mood, density, exclude) avec table
  symbolic→concrete et défauts mood-aware. Garde-fou anti-AI-slop intégré
  (refuse Tailwind indigo en accent, gradient 2-stops trust, etc.). Output :
  9 sections H2 numérotées (format open-design). Trigger : "from brief",
  "génère un design depuis", "DS pour <type de produit>", "DS dark, accent
  coral, typo serif".
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash(ls:*)
od:
  mode: design-system
  category: design-systems
  design_system:
    requires: false
    generates: true
  craft:
    requires: [anti-ai-slop, color, typography]
  inputs:
    primary: brief
  outputs:
    primary: designs/active.md
---

# Skill `design-from-brief`

Tu génères un `designs/active.md` complet depuis un brief user (texte libre ou format structuré). Workflow : parser le brief → résoudre 8 dimensions → anti-pattern check → confirmer overwrite si besoin → écrire le DESIGN.md format open-design (9 sections H2 numérotées) → reporter les défauts appliqués.

## Background

Les 8 dimensions sont distillées de l'analyse des 71 design systems open-design. Chaque DESIGN.md résout au minimum : palette, accent, typo body, typo display, layout, style composants. On ajoute mood et density car ce sont les 2 sources principales d'ambiguïté en brief naturel ("clean", "moderne" → veut dire des choses différentes selon les users).

**Hors scope** : animation timing, responsive strategy, accessibilité contraste — gérés en aval (par les composants) ou implicitement (les défauts shadcn sont déjà conformes WCAG AA dans la plupart des cas).

## Invariants (jamais violer)

- Écrit **un seul fichier** : `designs/active.md`. Si présent → demande confirmation overwrite.
- Ne touche **jamais** : `src/styles/globals.css`, `tailwind.config.*`, `.tsx`, ni les seeds (`_shared/seeds/*.md` lecture seule).
- Ordre forcé : parser brief → résoudre 8 dimensions → anti-pattern check → check overwrite → Write → re-Read (audit) → report.
- Format de sortie : **9 sections H2 numérotées strict** (`## 1.` à `## 9.`). Wording lenient sur le titre après le numéro.
- Toutes les valeurs hex/typo viennent de la **table de résolution** (Section 4 ci-dessous). Jamais d'invention.
- Le report **suggère explicitement** `design-apply` comme prochain pas. Ne pas auto-invoquer.

## Références à charger

- [`skills/_shared/design-md-schema.md`](../_shared/design-md-schema.md) — format DESIGN.md (9 sections numérotées, sub-headings tolérants Section 2)
- [`skills/_shared/craft/anti-ai-slop.md`](../_shared/craft/anti-ai-slop.md) — 7 péchés cardinaux P0
- [`skills/_shared/craft/color.md`](../_shared/craft/color.md) — palette structure 4 layers, accent discipline
- [`skills/_shared/craft/typography.md`](../_shared/craft/typography.md) — type scale, letter-spacing rules, font pairing
- [`skills/_shared/seeds/`](../_shared/seeds/) — exemples de DESIGN.md complets (claude, cohere, mistral-ai)

## STEP 1 — Accepter le brief

Deux formats acceptés :

**Option A — I-Lang structuré** :
```
[PLAN:@DESIGN|type=saas_landing]
  |palette=light_clean|accent=coral
  |typography=inter|display=space_grotesk
  |layout=single_column|mood=professional_minimal
  |density=spacious|exclude=animations,gradients
```

**Option B — Langage naturel** :
> "DS pour un dev tool, dark mode, accent coral, typo Inter, pas d'anim flashy."

Si Option B → convertir vers I-Lang via la table de mapping STEP 2, puis continuer.

## STEP 2 — Mapping naturel → dimensions

Pour chaque phrase du brief naturel, identifier les keywords et mapper vers une valeur structurée :

| Phrase naturelle | Dimension | Valeur I-Lang |
|---|---|---|
| « dark mode », « dark theme » | palette | `monochrome_dark` |
| « light », « white background » | palette | `light_clean` |
| « earthy », « warm tones » | palette | `earth_tones` |
| « navy », « bleu marine » | palette | `navy_and_white` |
| « pop of color », « vibrant » | accent | `coral` ou `electric_blue` |
| « subtle accent », « discret » | accent | `muted_sage` ou `slate` |
| « clean », « minimal », « simple » | mood | `professional_minimal` |
| « playful », « fun », « friendly » | mood | `playful` |
| « bold », « brutalist », « raw » | mood | `brutalist` |
| « editorial », « magazine » | mood | `editorial` |
| « spacious », « lots of whitespace » | density | `spacious` |
| « compact », « dense », « info-rich » | density | `compact` |
| « Inter », « system font » | typography | `inter` |
| « serif », « traditional » | typography | `georgia` ou `playfair` |
| « monospace », « code-like » | typography | `jetbrains_mono` |
| « no animations », « static » | exclude | `animations` |
| « no gradients » | exclude | `gradients` |
| « single page » | layout | `single_column` |
| « two columns », « sidebar » | layout | `two_column` |

Si une phrase mappe sur plusieurs dimensions ("clean dark landing" → mood=professional_minimal + palette=monochrome_dark + layout=single_column), résoudre chaque indépendamment.

Si une valeur user n'est **pas** dans la table (ex `palette=ocean_blue`) → demander clarification :
> "Je ne reconnais pas `palette=ocean_blue`. Tu veux dire `navy_and_white`, `monochrome_dark`, `light_clean`, ou `earth_tones` ?"

Pas de devinette.

## STEP 3 — Résoudre les 8 dimensions

Vocabulaire fermé. Toute valeur non listée = clarification requise (pas d'invention).

| # | Dimension | Clé | Valeurs valides |
|---|---|---|---|
| 1 | Palette | `palette` | `navy_and_white`, `earth_tones`, `monochrome_dark`, `light_clean` |
| 2 | Accent | `accent` | `coral`, `electric_blue`, `emerald`, `muted_sage`, `slate`, `rosy` |
| 3 | Typo body | `typography` | `inter`, `system_ui`, `dm_sans`, `georgia`, `jetbrains_mono` |
| 4 | Typo display | `display` | `space_grotesk`, `clash_display`, `same_as_body`, `playfair` |
| 5 | Layout | `layout` | `single_column`, `two_column`, `asymmetric` |
| 6 | Mood | `mood` | `professional_minimal`, `playful`, `brutalist`, `editorial` |
| 7 | Density | `density` | `compact`, `balanced`, `spacious` |
| 8 | Exclude | `exclude` | `animations`, `gradients`, `stock_photos`, `carousel`, `none` |

### 3a. Défauts mood-aware (dimensions non spécifiées)

| Dimension manquante | Règle de défaut |
|---|---|
| `palette` | mood=editorial → `light_clean` ; mood=brutalist → `monochrome_dark` ; sinon → `light_clean` |
| `accent` | palette dark → `coral` ; palette light → `electric_blue` |
| `typography` | toujours → `inter` (legibilité cross-platform) |
| `display` | mood=editorial → `playfair` ; mood=brutalist → `space_grotesk` ; sinon → `same_as_body` |
| `layout` | toujours → `single_column` (safest responsive) |
| `mood` | toujours → `professional_minimal` (least opinionated) |
| `density` | toujours → `balanced` |
| `exclude` | toujours → `none` |

Tracker chaque défaut appliqué pour le report STEP 7.

## STEP 4 — Tables symbolic → concrete

Avant Write : résoudre les valeurs symboliques en tokens concrets.

### 4a. Palettes (light + dark scope minimal)

| Symbolic | Background | Card/Surface | Foreground | Muted Foreground |
|---|---|---|---|---|
| `light_clean` | `#FFFFFF` | `#F8FAFC` | `#0F172A` | `#64748B` |
| `monochrome_dark` | `#09090B` | `#18181B` | `#FAFAFA` | `#A1A1AA` |
| `navy_and_white` | `#0F172A` | `#1E293B` | `#F8FAFC` | `#94A3B8` |
| `earth_tones` | `#FFFBEB` | `#FEF3C7` | `#451A03` | `#92400E` |

### 4b. Accents

| Symbolic | Accent | Hover |
|---|---|---|
| `coral` | `#F97316` | `#EA580C` |
| `electric_blue` | `#3B82F6` | `#2563EB` |
| `emerald` | `#10B981` | `#059669` |
| `muted_sage` | `#84A98C` | `#6B8F73` |
| `slate` | `#64748B` | `#475569` |
| `rosy` | `#DF1B41` | `#B81835` |

### 4c. Typo body

| Symbolic | Stack | Weight body | Size/Leading |
|---|---|---|---|
| `inter` | `Inter, ui-sans-serif, system-ui, sans-serif` | 400 | 1rem / 1.6 |
| `system_ui` | `ui-sans-serif, system-ui, sans-serif` | 400 | 1rem / 1.6 |
| `dm_sans` | `'DM Sans', ui-sans-serif, system-ui, sans-serif` | 400 | 1rem / 1.6 |
| `georgia` | `Georgia, 'Iowan Old Style', serif` | 400 | 1.125rem / 1.7 |
| `jetbrains_mono` | `'JetBrains Mono', ui-monospace, monospace` | 400 | 0.95rem / 1.55 |

### 4d. Typo display

| Symbolic | Stack | Weight | Size |
|---|---|---|---|
| `space_grotesk` | `'Space Grotesk', ui-sans-serif, system-ui, sans-serif` | 700 | clamp(2rem, 5vw, 3.5rem) |
| `clash_display` | `'Clash Display', ui-sans-serif, system-ui, sans-serif` | 700 | clamp(2rem, 5vw, 3.5rem) |
| `playfair` | `'Playfair Display', Georgia, serif` | 700 | clamp(2rem, 5vw, 3.5rem) |
| `same_as_body` | inherit body font, weight 600 | 600 | clamp(1.75rem, 4.5vw, 3rem) |

### 4e. Density

| Symbolic | Section spacing | Content padding |
|---|---|---|
| `compact` | 48px | 16px / 24px |
| `balanced` | 72px | 24px / 40px |
| `spacious` | 96px | 24px / 48px |

### 4f. Composants (mood-aware)

| Mood | Boutons | Cards | Inputs | Shadows |
|---|---|---|---|---|
| `professional_minimal` | `radius: 6px`, accent bg | surface bg, 1px border, `radius: 12px` | transparent bg, bottom border | none |
| `playful` | `radius: 9999px` (full), accent bg | surface bg, soft shadow, `radius: 16px` | rounded, soft border | subtle sm |
| `brutalist` | `radius: 0`, contrast bg, hard 2px border | surface bg, hard 2px border, `radius: 0` | `radius: 0`, thick 2px border | hard 4px offset |
| `editorial` | `radius: 4px`, subtle bg | surface bg, hairline border, `radius: 8px` | bottom border seul | none |

## STEP 5 — Anti-pattern check (P0 bloquant)

Avant Write, vérifier que la résolution ne déclenche aucun péché cardinal de [`_shared/craft/anti-ai-slop.md`](../_shared/craft/anti-ai-slop.md) :

| Check | Action si violé |
|---|---|
| Accent résolu ∈ `{#6366f1, #4f46e5, #4338ca, #3730a3, #8b5cf6, #7c3aed, #a855f7}` | Bloquer + suggérer alternative (`coral`, `rosy`, `electric_blue`) |
| Typo body = `system_ui` **et** typo display = `same_as_body` | Warning ; suggérer une combinaison plus intentional (cf. typography.md "Never set system-ui alone on heading") |
| Brief mentionne "gradient trust", "purple→blue hero", etc. | Refuser dans le DESIGN.md ; émettre `## 7. Don't` qui interdit explicitement le gradient 2-stops |
| Brief demande des emoji icons (`🚀`, `✨`, etc.) | Refuser ; émettre `## 7. Don't` qui interdit l'emoji-as-icon |

Si l'user insiste après explication → appliquer mais l'inscrire en clair dans `## 7. Don't` (ironie volontaire : la marque assume sa transgression).

## STEP 6 — Check overwrite et Write

Si `designs/active.md` existe déjà :

```
designs/active.md existe déjà. Tu veux :
1. L'écraser avec le nouveau DESIGN.md généré (perte du contenu actuel)
2. Annuler (pour modifier l'existant, utilise `design-refine`)
```

Attendre confirmation explicite avant Write.

Composer le DESIGN.md selon le squelette ci-dessous (9 H2 numérotés strict, valeurs depuis tables 4a-f) :

```markdown
# Design System for <Project Name>

> Category: <category dérivé du brief — ex "AI & LLM", "Developer Tools", "Editorial">
> <tagline une phrase, dérivée de mood + palette>

## 1. Visual Theme & Atmosphere

- Mood : <mood> — <feel dérivé : professional_minimal → "Clean, confident, restrained" ; playful → "Soft, approachable, energetic" ; brutalist → "Raw, exposed, unapologetic" ; editorial → "Magazine-like, hierarchical, considered">
- References : <si editorial → "Monocle, Cereal" ; si brutalist → "Exposed grids, raw typography" ; si playful → "Friendly product onboarding" ; sinon → "Considered minimalism">

## 2. Color Palette & Roles

### Primary
- **Primary** (`<accent.Accent>`) : couleur d'accent principale, CTA primaires.
- **Primary Hover** (`<accent.Hover>`) : état hover/pressed.

### Surface & Background
- **Background** (`<palette.Background>`) : canvas de page.
- **Card** (`<palette.Card/Surface>`) : containers élevés, cards.

### Text
- **Foreground** (`<palette.Foreground>`) : texte primaire, headlines.
- **Muted Foreground** (`<palette.Muted Foreground>`) : texte secondaire, captions.

### Semantic
- **Destructive** (`#DC2626`) : erreurs, suppressions.
- **Border** : dérivé du Foreground à 12% opacité.

<si palette = light_clean ou earth_tones, ajouter ### Dark Mode avec inversion mécanique :>
### Dark Mode
- **Background** (`#09090B`)
- **Card** (`#18181B`)
- **Foreground** (`#FAFAFA`)
- **Muted Foreground** (`#A1A1AA`)
- **Primary** (boost L de +0.18 sur accent light, garder hue+chroma)

## 3. Typography Rules

### Font Family
- **Body** : <typography.Stack>, <weight>, <size/leading>
- **Display** : <display.Stack>, <weight>, <size>
- **Mono** : `'JetBrains Mono', ui-monospace, monospace`, 400, 0.875rem (utility face pour code/data)

### Hierarchy
- Display : 48–72px, line-height 1.1, letter-spacing -0.02em
- H1 : 32–48px, line-height 1.2, letter-spacing -0.01em
- H2 : 24–32px, line-height 1.3
- Body : 15–18px, line-height 1.6, letter-spacing 0
- Small : 13–14px, line-height 1.5, letter-spacing 0.01em
- ALL CAPS (si utilisé) : letter-spacing 0.06em–0.1em (jamais sans positive tracking)

### Principles
- Max 2 typefaces (display + body). Mono utility ne compte pas.
- Body width : `max-width: 65ch` (50-75 chars/line).
- 3 weights max : Read (400), Emphasize (550), Announce (600).

## 4. Component Stylings

### Buttons
- Primary : <mood-aware bouton>
- Secondary : surface bg, 1px border, foreground text
- Ghost : transparent, foreground text au hover

### Cards
<mood-aware card>

### Inputs
<mood-aware input>

### Radius
- Base : <selon mood>

## 5. Layout Principles

- Max width : 1200px (container)
- Grid : <layout — single_column / two_column / asymmetric>
- Section spacing : <density.Section spacing>
- Content padding : <density.Content padding>
- Vertical rhythm : multiples de 8px

## 6. Depth & Elevation

- Shadows : <mood-aware shadows>
- Borders : 1px solid (Foreground à 8-12% opacité)
- Hover transitions : <si exclude=animations → "none, no transitions" ; sinon → "150ms ease-out sur background, color, border">

## 7. Do's and Don'ts

### Do
- Utiliser exclusivement les tokens déclarés en Section 2.
- Maintenir un spacing inter-section cohérent (Section 5).
- Respecter le ratio de contraste WCAG AA (4.5:1 body, 3:1 large text).

### Don't
- Inventer des couleurs hors palette.
- Utiliser plus de 2 typefaces (mono exclu, c'est une face utilitaire).
- Default Tailwind indigo (`#6366f1`) en accent — c'est le tell #1 LLM-generated.
- Gradient 2-stops "trust" en hero (purple→blue, blue→cyan, indigo→pink).
- Emoji `✨🚀🎯⚡` comme icônes — utiliser SVG monoline `currentColor`.
<si exclude contient items → ajouter "Don't <item>" pour chaque>

## 8. Responsive Behavior

- Breakpoints : 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Mobile : single column, stack vertical de toutes les sections
- Tablet : autoriser grids 2-col pour features
- Desktop : layout complet avec max-width
- Images : fluid, max-width 100%, aspect-ratio préservé

## 9. Agent Prompt Guide

- Voice : <dérivé de mood — professional_minimal : "Confident, concise, no fluff" ; playful : "Warm, energetic, conversational" ; brutalist : "Direct, unapologetic, declarative" ; editorial : "Considered, hierarchical, deliberate">
- Microcopy : préférer verbes d'action ("Start tracking" vs "Get started").
- Accent visuel : maximum 2 utilisations par viewport (cf. color.md).
- Tous les éléments interactifs : `:focus-visible` outline obligatoire.
<si exclude contient items → ajouter "Do NOT use <item>" pour chaque>
```

Write `designs/active.md` avec ce contenu, valeurs résolues injectées.

## STEP 7 — Re-Read + Report

```
Read designs/active.md
```

Vérifier sur le contenu relu :
- H1 présent (ligne 1).
- 9 H2 numérotés présents et dans l'ordre (`^## [1-9]\. `).
- Section 2 contient ≥1 hex backtické.
- Aucun `#6366f1` (ou autre indigo Tailwind) dans Section 2.

Si une vérif échoue : Edit ciblé + re-Read. Max 2 tentatives, sinon abort.

Report final (5 lignes max) :

```
✓ designs/active.md généré : <H1> — <category>
✓ 8 dimensions résolues — palette=<X>, accent=<Y>, mood=<Z>...
ℹ Défauts appliqués (dimensions non spécifiées) :
  - <dimension>: <valeur> (règle: <rule>)
→ Pour matérialiser dans le CSS : `design-apply` (génère src/styles/globals.css)
→ Pour itérer : `design-refine` ("primary plus chaud", "radius plus grand"...)
```

La ligne "Défauts appliqués" est **obligatoire** si ≥1 défaut a été appliqué — transparence pour éviter les assomptions silencieuses.

## Anti-patterns à éviter

- **Inventer une valeur hors table** : si l'user demande `palette=ocean_blue`, demander clarif. Pas de devinette.
- **Skipper le défaut mood-aware** : c'est ce qui produit des combinaisons cohérentes (editorial+playfair, brutalist+space_grotesk).
- **Skipper le tracking des défauts pour le report** : transparence cassée → user peut être surpris d'un choix qu'il n'a pas demandé.
- **Auto-invoquer `design-apply`** : split v2, suggérer seulement.
- **Écraser `designs/active.md` sans confirmation** : l'user a peut-être un travail en cours.
- **Ignorer le craft check** : indigo Tailwind en accent = blocage P0, même si l'user le demande explicitement (sauf insistance après warning).
- **Émettre du HTML preview** : open-design `design-brief` génère un `brief-preview.html`. Hors scope v1 (cf. plan global).
