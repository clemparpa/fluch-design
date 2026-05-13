# Tokens canoniques shadcn (variant Base UI)

22 variables CSS attendues par les composants shadcn. Toutes émises en OKLCH dans `:root` (light) et `.dark` (dark) de `src/styles/globals.css`.

## Liste exhaustive

| Var | Rôle | Light défaut | Dark défaut |
|---|---|---|---|
| `--background` | Fond de page | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | Texte principal | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--card` | Fond des cards | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--card-foreground` | Texte sur card | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--popover` | Fond popover/menu | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--popover-foreground` | Texte popover | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | Action principale | (DS) | (DS) |
| `--primary-foreground` | Texte sur primary | dérivé | dérivé |
| `--secondary` | Action secondaire | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--secondary-foreground` | Texte sur secondary | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--muted` | Fond atténué | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted-foreground` | Texte atténué | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--accent` | Accent (hover, focus) | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--accent-foreground` | Texte sur accent | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--destructive` | Erreur/danger | (DS) | (DS) |
| `--destructive-foreground` | Texte destructive | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--border` | Bordures | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `--input` | Bordure/fond input | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `--ring` | Focus ring | dérivé de primary | dérivé de primary |
| `--radius` | Radius de base | `0.625rem` | `0.625rem` |
| `--font-sans` | Stack sans-serif | stack | stack |
| `--font-mono` | Stack mono | stack | stack |

(DS) = doit être fourni par la section Color de `designs/active.md`. Les 4 obligatoires : `primary`, `background`, `foreground`, `destructive` — pour chacun des scopes light ET dark.

## Règles de dérivation

Appliquer dans cet ordre quand un token n'est pas explicitement fourni dans DESIGN.md.

### `*-foreground` paires
Pour `<token>-foreground` (primary-foreground, destructive-foreground, etc.) :
- Si L de `<token>` > 0.65 → foreground = `oklch(0.205 0 0)` (presque noir — lit sur surface claire)
- Sinon → foreground = `oklch(0.985 0 0)` (presque blanc — lit sur surface foncée ou mid-range saturée)

Le seuil 0.65 (vs 0.5 naïf) reflète le fait que des couleurs vibrantes à mid-lightness (genre `#635bff` L≈0.58) ont besoin d'un texte clair pour rester lisibles, malgré une L > 0.5.

### `secondary`, `muted`, `accent`
Si non fourni → utiliser les défauts du tableau (gris neutres).

### `card`, `popover`
Si non fourni → identiques à `background` du même scope.

### `border`, `input`
Si non fourni → défaut neutre du tableau (jamais dérivé du primary).

### `ring`
Si non fourni → reprendre la valeur de `--primary` du même scope mais avec L ajustée :
- Light : `--ring` = primary avec L=0.708 maximum (pour ne pas être trop sombre)
- Dark : `--ring` = primary avec L=0.556 minimum

### `--radius`
Si la section Components de DESIGN.md ne précise pas, défaut `0.625rem`.

### `--font-sans` / `--font-mono`
Si la section Typography ne précise pas, défaut :
- `--font-sans: 'Inter', system-ui, sans-serif`
- `--font-mono: 'JetBrains Mono', ui-monospace, monospace`

## Valeurs OKLCH spéciales

- `oklch(0 0 0)` = noir pur
- `oklch(1 0 0)` = blanc pur
- Pour un gris neutre : `oklch(L 0 0)` (chroma = 0, hue indifférente)
- Bornes : L ∈ [0, 1], C ∈ [0, 0.4], H ∈ [0, 360]
