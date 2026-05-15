# DESIGN.md schema (v2 — open-design canonical)

Cette doc décrit le format d'un fichier `DESIGN.md`. Les 5 skills de `skills/` lisent et/ou écrivent ce format.

Source de vérité : convention [awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design), adoptée par [nexu-io/open-design](https://github.com/nexu-io/open-design) (~140 seeds vendored). Notre v2 utilise le **même format verbatim** pour pouvoir consommer les seeds sans transformation.

## En-tête de fichier

```md
# Design System Inspired by <Brand>

> Category: <category>
> <optional tagline en une phrase>
```

- **H1** : doit commencer par `# `. Le préfixe `Design System Inspired by` est conventionnel ; les skills de `skills/` ne le requièrent pas (un seed local sans préfixe reste valide).
- **`> Category:`** : ligne 3, blockquote. Vocabulaire suggéré (lenient) : `AI & LLM`, `Developer Tools`, `Productivity`, `Fintech`, `E-Commerce`, `Mobility`, `Media`, `Editorial`, `Automotive`, `Other`. Les seeds open-design utilisent parfois des libellés hors-liste — on tolère.
- **Tagline** : blockquote optionnelle, ligne 4.

## Les 9 sections H2

Toutes obligatoires, **numérotation strict** (`## 1.`, `## 2.`, …, `## 9.`), **wording lenient** (un seed peut écrire `## 7. Interaction & Motion` à la place de `## 7. Do's and Don'ts`).

| # | H2 canonique | Rôle |
|---|---|---|
| 1 | `## 1. Visual Theme & Atmosphere` | Prose libre, ambiance, philosophie. Pas de tokens. |
| 2 | `## 2. Color Palette & Roles` | Couleurs (light + dark). **Section critique pour `design-apply`** — elle alimente le `:root` shadcn. Format détaillé ci-dessous. |
| 3 | `## 3. Typography Rules` | Stacks de fonts, hiérarchie (table de tailles), principes. |
| 4 | `## 4. Component Stylings` | Boutons, cards, inputs, navigation, formes. |
| 5 | `## 5. Layout Principles` | Spacing scale, grid, container, rythme vertical. |
| 6 | `## 6. Depth & Elevation` | Shadows, layering. Souvent contient les transitions de hover/depth (motion). |
| 7 | `## 7. Do's and Don'ts` | Listes Do/Don't (parfois ✅/❌, parfois sub-headings `### Do` / `### Don't`). |
| 8 | `## 8. Responsive Behavior` | Breakpoints, mobile-first vs desktop-first, conventions de collapse. |
| 9 | `## 9. Agent Prompt Guide` | Voice, copy, ton — guide pour un LLM générant du contenu dans cette identité. |

Sanity check minimal pour qu'un DESIGN.md soit jugé exploitable :
1. H1 présent.
2. 9 H2 numérotés présents (`^## [1-9]\. ` pour chacun).
3. Section 2 contient ≥1 hex/rgba/oklch backtické.

Tout le reste est de la prose. Une section vide est tolérée mais déconseillée.

## Section 2 (Color) — patterns observés

Pas de structure imposée pour les sub-headings. Les seeds open-design utilisent des **nomenclatures hétérogènes** ; voici 4 patterns observés. `design-apply` doit faire du *keyword matching tolérant*, jamais du regex strict sur des noms de sub-heading spécifiques.

### Pattern A — split par rôle sémantique (claude, mistral-ai)

```md
## 2. Color Palette & Roles

### Primary
- **<Name>** (`#hex`): description.

### Secondary & Accent
- **<Name>** (`#hex`): description.

### Surface & Background
- **<Name>** (`#hex`): description.
- **Dark Surface** (`#hex`): dark-theme container.   ← dark tokens entremêlés ici

### Neutrals & Text
- **<Name>** (`#hex`): description.

### Semantic & Accent
- **<Name>** (`#hex`): description.

### Gradient System
- prose libre OU bullets ponctuels (info-only, non émis par design-apply)
```

Particularité : pas de `### Dark Mode` séparé. Les tokens dark sont mélangés aux light dans `Surface & Background`, identifiables par leur nom (`Dark Surface`, `Deep Dark`, `Border Dark`).

### Pattern B — split light vs dark (xiaohongshu, nombreux seeds)

```md
## 2. Color Palette & Roles

### Primary Brand
- **<Name>** (`#hex`): rôle.

### Neutrals
- **Surface**, **Canvas**, **Fill 1/2/3** …

### Text
- **Title** (`rgba(0,0,0,0.80)`)
- **Paragraph** (`rgba(0,0,0,0.62)`)

### Semantic
- **Success**, **Warning**, **Danger** …

### Dark Mode
- **Surface** (`#hex`)
- **Canvas** (`#hex`)
- **Title** / **Paragraph** (rgba blancs)
- **Brand Primary** (`#hex`)
```

Particularité : `### Dark Mode` est une **sous-section** de Section 2, pas une section H2 séparée.

### Pattern C — split par token shadcn-like (cohere, certains modernes)

```md
## 2. Color Palette & Roles

### Background Surfaces
- **Background** (`#hex`)
- **Card** (`#hex`)
- **Popover** (`#hex`)

### Foreground
- **Foreground** (`#hex`)
- **Muted Foreground** (`#hex`)

### Brand
- **Primary** (`#hex`)
- **Accent** (`#hex`)

### Borders & Inputs
- **Border** (`#hex`)
- **Input** (`#hex`)
- **Ring** (`#hex`)
```

Particularité : déjà aligné sur le vocabulaire shadcn — `design-apply` peut faire un mapping presque 1:1.

### Pattern D — flat sans sub-headings (rares, anciens seeds)

```md
## 2. Color Palette & Roles

- **Primary** (`#hex`): brand color.
- **Background** (`#hex`): page bg.
- **Foreground** (`#hex`): text.
- … etc.
```

Tout en une seule liste. `design-apply` doit gérer ce cas en parsant tous les bullets de la section sans s'attendre à des sub-headings.

## Format des items couleur

Conventions tolérées par `design-apply` (matching tolérant) :

- `` - **<Name>** (`<value>`): <description> ``
- `` - **<Name>** (`<value>`) — <description> ``
- `` - **<Name>**: `<value>` — <description> ``

`<value>` peut être :
- hex : `#635bff`, `#fff`
- rgba : `rgba(0, 0, 0, 0.80)`
- oklch : `oklch(0.578 0.235 278)` ou `oklch(0.578 0.235 278 / 50%)`

Les 3 formes sont supportées par [`_shared/tools/oklch.mjs`](tools/oklch.mjs) ; mélanger dans le même fichier est autorisé.

## Pas de section Spacing/Motion dédiée

Le schéma open-design ne prévoit **pas** de section `## Spacing` ni `## Motion`. Conséquences pour `design-apply` :

- `--spacing-*` et `--duration-*` shadcn ne sont **pas extraits** depuis DESIGN.md ; on hérite des défauts Tailwind v4.
- Si l'auteur veut customiser, il l'écrit en prose dans `## 5. Layout Principles` ou `## 6. Depth & Elevation`. `design-apply` peut éventuellement parser des durations explicites (`hover transitions 200ms`) mais c'est best-effort.
- Perte de granularité acceptée vs un schéma plus riche — gain : compat verbatim avec ~140 seeds.

## Mapping vers shadcn

Le mapping détaillé Section 2 → tokens shadcn (`--background`, `--foreground`, `--primary`, `--card`, etc.) vit dans [`shadcn/css-mapping.md`](shadcn/css-mapping.md). Ce fichier-ci décrit le format d'entrée ; `css-mapping.md` décrit la transformation de sortie.

Les 32 tokens shadcn cibles (Tailwind v4, style `new-york-v4`) sont listés dans [`shadcn/tokens.md`](shadcn/tokens.md).

## Worked example

Référence vivante : [`seeds/claude.md`](seeds/claude.md) — DESIGN.md complet open-design, format canonique, dark tokens en Pattern A.

Pour comparer 3 patterns différents : [`seeds/cohere.md`](seeds/cohere.md), [`seeds/mistral-ai.md`](seeds/mistral-ai.md).
