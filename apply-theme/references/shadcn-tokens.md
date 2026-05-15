# Tokens canoniques shadcn (style new-york-v4, Tailwind v4)

32 variables CSS attendues par les composants shadcn modernes. Toutes émises en OKLCH dans `:root` (light) et `.dark` (dark) de `src/styles/globals.css`.

Source canonique : repo `shadcn-ui/ui`, `apps/v4/registry/_legacy-base-colors.ts` (défauts OKLCH), `apps/v4/registry/config.ts` (`DEFAULT_RADIUS_VALUE`), bloc `@theme inline` généré par `shadcn init`.

> **Variant cible v1** : `new-york-v4` (style par défaut sur Tailwind v4 — l'ancien `default` est déprécié). Le flag `--base base` (Base UI) émet la même structure de vars — seul le code des composants diffère.

## 1. Core (18 couleurs + 1 radius)

| Var | Rôle | Light défaut | Dark défaut |
|---|---|---|---|
| `--background` | Fond de page | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | Texte principal | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--card` | Fond des cards | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--card-foreground` | Texte sur card | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--popover` | Fond popover/menu | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--popover-foreground` | Texte popover | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | Action principale | (DS) | (DS) |
| `--primary-foreground` | Texte sur primary | dérivé | dérivé |
| `--secondary` | Action secondaire | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--secondary-foreground` | Texte sur secondary | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--muted` | Fond atténué | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted-foreground` | Texte atténué | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--accent` | Accent (hover, focus) | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--accent-foreground` | Texte sur accent | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--destructive` | Erreur/danger | (DS) `oklch(0.577 0.245 27.325)` | (DS) `oklch(0.704 0.191 22.216)` |
| `--destructive-foreground` | Texte destructive | dérivé (cf. règle) | dérivé (cf. règle) |
| `--border` | Bordures | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--input` | Bordure/fond input | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` |
| `--ring` | Focus ring | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |
| `--radius` | Radius de base | `0.625rem` | (hérité du `:root`) |

(DS) = doit être fourni par `## 2. Color Palette & Roles` de `designs/active.md`. Les 4 obligatoires : `primary`, un background/canvas, un foreground/title, et un destructive/danger — light (sous-blocs Neutrals/Text/Semantic) et dark (`### Dark Mode`).

> **Note `--destructive-foreground`** : vanilla `shadcn init` (new-york-v4) ne définit PAS cette var en `:root`/`.dark` (les composants destructive utilisent `text-white` direct dans leurs classes). Le skill l'émet quand même via la règle de dérivation, pour rendre les thèmes custom robustes — si l'utilisateur surcharge `--destructive`, la paire foreground reste cohérente même si un composant tiers la consomme.

> **Note `--border` / `--input` dark** : shadcn utilise un blanc avec alpha (`oklch(1 0 0 / 10%)`, `/ 15%`) plutôt qu'un gris solide. Ça s'adapte à n'importe quelle teinte de `--background` dark. Si le DS override `--background` dark, garder ce pattern alpha — ne pas convertir en gris solide.

> **Note `--ring`** : défaut shadcn = **gris neutre indépendant de `--primary`**. Une dérivation depuis primary (hue match) est une option custom mais pas le comportement vanilla.

## 2. Charts (5)

| Var | Light défaut | Dark défaut |
|---|---|---|
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` |
| `--chart-2` | `oklch(0.6 0.118 184.704)` | `oklch(0.696 0.17 162.48)` |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)` |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)` |
| `--chart-5` | `oklch(0.769 0.188 70.08)` | `oklch(0.645 0.246 16.439)` |

Optionnel dans DESIGN.md (cf. `design-md-schema.md`). Si le designer ne précise pas une palette data-viz custom, garder les défauts shadcn (palette vibrante orientée graphes).

## 3. Sidebar (8)

| Var | Light défaut | Dark défaut |
|---|---|---|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |

Optionnel dans DESIGN.md. Émis par le skill avec ces défauts si non précisés (compatible `shadcn add sidebar`).

## 4. Fonts (3, émises en `:root` côté skill)

Pas émises dans `:root` par `shadcn init` vanilla (Next.js les injecte via `next/font`). **En Vite (notre cible), le skill DOIT les définir dans `:root`** sous forme de stacks litéraux, sinon les mappings `@theme inline` renvoient à du vide.

| Var | Défaut skill |
|---|---|
| `--font-sans` | `'Inter', system-ui, sans-serif` |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace` |
| `--font-heading` | `var(--font-sans)` (réutilise sans, sauf override DS) |

## Règles de dérivation

Appliquer dans cet ordre quand un token n'est pas explicitement fourni dans DESIGN.md.

### `*-foreground` paires
Pour `<token>-foreground` (primary-foreground, destructive-foreground, etc.) :
- Si L de `<token>` > 0.65 → foreground = `oklch(0.205 0 0)` (presque noir — lit sur surface claire)
- Sinon → foreground = `oklch(0.985 0 0)` (presque blanc — lit sur surface foncée ou mid-range saturée)

Le seuil 0.65 (vs 0.5 naïf) reflète que des couleurs vibrantes à mid-lightness (genre `#635bff` L≈0.58) ont besoin d'un texte clair malgré une L > 0.5.

### `secondary`, `muted`, `accent`
Si non fourni → défauts du tableau (gris neutres). Si le designer veut une couleur custom, la fournir explicitement dans DESIGN.md.

### `card`, `popover`
- Light : si non fourni → identique à `--background` du même scope.
- Dark : si non fourni → légèrement plus clair que background (`oklch(0.205 0 0)` par défaut, ~L+0.06 vs `--background` dark `oklch(0.145 0 0)`). Si le DS override le background dark, conserver ce delta de L.

### `border`, `input`
Si non fourni → défauts du tableau. **Jamais dérivé du primary.** En dark, conserver le pattern alpha (`oklch(1 0 0 / 10%)`, `/ 15%`).

### `ring`
Si non fourni → défaut gris neutre (`oklch(0.708 0 0)` light / `oklch(0.556 0 0)` dark). **C'est le défaut shadcn**, indépendant de `--primary`. Une dérivation depuis primary est possible mais doit être explicite dans DESIGN.md.

### `--radius`
Si `## 4. Component Stylings` de DESIGN.md ne précise pas → défaut `0.625rem`.

### Charts et sidebar (5 + 8 vars)
Si non fournis → défauts des tableaux §2 et §3. Pour ne pas réinventer une palette de charts à chaque thème, garder les défauts shadcn sauf demande explicite. Pour la sidebar, les défauts forment une mini-palette neutre cohérente avec le core — l'override n'a de sens que si le DS prévoit une sidebar typée (ex: branding sombre permanent).

### `--font-sans` / `--font-mono` / `--font-heading`
Si `## 3. Typography Rules` ne précise pas :
- `--font-sans: 'Inter', system-ui, sans-serif`
- `--font-mono: 'JetBrains Mono', ui-monospace, monospace`
- `--font-heading: var(--font-sans)` (réutilise sans)

## Valeurs OKLCH spéciales

- `oklch(0 0 0)` = noir pur
- `oklch(1 0 0)` = blanc pur
- Pour un gris neutre : `oklch(L 0 0)` (chroma = 0, hue indifférente)
- Alpha : `oklch(L C H / A)` où A ∈ [0, 1] ou pourcentage (ex: `oklch(1 0 0 / 10%)`)
- Bornes : L ∈ [0, 1], C ∈ [0, 0.4], H ∈ [0, 360]
