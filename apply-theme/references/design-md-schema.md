# Schéma `DESIGN.md` (9 sections obligatoires)

Format hérité d'open-design / `VoltAgent/awesome-claude-design`. C'est le contrat strict que tout `designs/active.md` et tout seed dans `.claude/skills/apply-theme/library/` doit respecter.

## En-tête de fichier

Toujours les 2 premières lignes :

```md
# <Nom du système>
> Category: <catégorie>
```

- H1 = picker label affiché à l'user
- Blockquote `> Category:` = groupe d'affichage

Catégories standards : `AI & LLM`, `Developer Tools`, `Productivity`, `Fintech`, `E-Commerce`, `Media`, `Automotive`, `Other`, `Starters`.

## Les 9 sections (H2 obligatoires, ordre strict)

Chaque section est un `## Nom`. Le corps peut être vide mais le H2 doit exister (le parser grep ne tolère pas l'absence).

### 1. `## Visual Theme & Atmosphere`
Prose libre. Ambiance, densité, philosophie, mood. N'émet pas de CSS direct mais informe les autres sections.

### 2. `## Color` (OBLIGATOIRE, light + dark)

Format :
```md
## Color

Light:
- primary: #635bff
- background: #ffffff
- foreground: #0a2540
- destructive: #df1b41

Dark:
- primary: #a5a5ff
- background: #0a2540
- foreground: #f6f9fc
- destructive: #ff5d76
```

**Minimum requis : 4 tokens × 2 scopes** = primary, background, foreground, destructive — dans Light ET Dark.

Tokens optionnels core : `secondary`, `accent`, `muted`, `border`, `input`, `ring`, `card`, `popover`, `primary-foreground`, `destructive-foreground`, `secondary-foreground`, `accent-foreground`, `muted-foreground`, `card-foreground`, `popover-foreground`.

Tokens optionnels charts (data-viz) : `chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5`. Si non fournis, le skill garde les défauts shadcn (palette vibrante).

Tokens optionnels sidebar : `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`. Si non fournis, le skill garde les défauts shadcn (mini-palette neutre cohérente avec le core).

Format de valeur : hex (`#RRGGBB`) ou OKLCH (`oklch(L C H)`).

**Règle de nommage** : sémantique (`primary`, `success`, `danger`, `info`). Jamais hue-based (`blue-500`, `red-700`).

### 3. `## Typography`

Format :
```md
## Typography

Font families:
- sans: 'Inter', system-ui, sans-serif
- mono: 'JetBrains Mono', ui-monospace, monospace
- heading: 'Inter', system-ui, sans-serif   # optionnel, reprend `sans` si absent
- display: 'Playfair Display', serif         # optionnel (= --font-display dans @theme)

Weights: 400, 500, 600, 700                  # optionnel
```

Si la section est vide ou n'a pas de stack → défaut Inter (sans + heading) + JetBrains (mono).

`sans`, `mono`, `heading` sont émis dans `:root` (`--font-sans`, `--font-mono`, `--font-heading`) car référencés par le bloc `@theme inline` canonique de shadcn. `display` (optionnel) va dans un bloc `@theme` séparé sous `--font-display`.

### 4. `## Spacing & Grid`

Format :
```md
## Spacing & Grid

Base: 0.25rem (4px)   # défaut Tailwind v4
Breakpoints: défaut   # ou liste custom
```

N'émettre dans globals.css que les **deltas** par rapport aux défauts Tailwind v4.

### 5. `## Layout & Composition`

Prose libre. Décrit les patterns de mise en page (grids, alignement, density). Pas d'émission CSS — informatif pour l'agent qui designera ensuite des pages.

### 6. `## Components`

Format :
```md
## Components

Radius: 0.5rem              # obligatoire
Shadow style: subtle        # subtle / soft / sharp / none
Border: 1px solid           # optionnel
```

`Radius` obligatoire (`--radius` dans CSS). `Shadow style` et `Border` optionnels.

### 7. `## Motion & Interaction`

Format :
```md
## Motion & Interaction

Durations:
- fast: 150ms
- base: 250ms
- slow: 400ms

Easing:
- standard: cubic-bezier(0.4, 0, 0.2, 1)
```

Si la section est vide → pas d'émission custom (Tailwind v4 défauts).

### 8. `## Voice & Brand`

Prose libre. Tone, copywriting, do/don't langagier. Pas d'émission CSS — résumé d'une phrase repris en commentaire d'en-tête de globals.css.

### 9. `## Anti-patterns`

Liste à puces :
```md
## Anti-patterns

- Pas de gradients flashy
- Pas de glassmorphism
- Pas de shadows lourdes
```

Pas d'émission CSS. Utilisé par `workflows/refine.md` pour valider qu'une modif demandée par l'user ne réintroduit pas un pattern banni.

## Exemple minimal complet

```md
# Stripe-inspired
> Category: Fintech

## Visual Theme & Atmosphere
Confiance institutionnelle, lisibilité maximale, espace généreux. Layout aéré, contrastes francs.

## Color

Light:
- primary: #635bff
- background: #ffffff
- foreground: #0a2540
- destructive: #df1b41

Dark:
- primary: #a5a5ff
- background: #0a2540
- foreground: #f6f9fc
- destructive: #ff5d76

## Typography

Font families:
- sans: 'Inter', system-ui, sans-serif
- mono: 'JetBrains Mono', monospace

Weights: 400, 500, 600

## Spacing & Grid

Base: défaut Tailwind v4.

## Layout & Composition

Hero centré large, cards à plat, séparateurs fins. Container max-w-6xl.

## Components

Radius: 0.375rem
Shadow style: subtle

## Motion & Interaction

Durations:
- fast: 150ms
- base: 250ms

## Voice & Brand

Direct, technique mais accessible. Pas de jargon corporate.

## Anti-patterns

- Pas de gradients flashy
- Pas de glassmorphism
- Pas de shadows lourdes
```
