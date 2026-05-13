# Mapping `DESIGN.md` → `globals.css`

Règles d'émission CSS depuis les 9 sections du DESIGN.md. Cible : `src/styles/globals.css`.

Cf. aussi `oklch-conversion.md` (couleurs) et `shadcn-tokens.md` (tokens dérivés).

## Structure complète du fichier produit

```css
/* Theme: <H1> — <category> */
/* Voice: <résumé Voice & Brand section, une phrase> */
@import 'tailwindcss';

:root {
  /* 22 tokens shadcn en OKLCH, valeurs LIGHT */
  --background: oklch(...);
  /* ... */
  --radius: 0.5rem;
  --font-sans: '...';
  --font-mono: '...';
}

.dark {
  /* 19 tokens couleurs en OKLCH, valeurs DARK
     (--radius, --font-sans, --font-mono restent au scope :root) */
  --background: oklch(...);
  /* ... */
}

@theme inline {
  /* 24 mappings invariants pour Tailwind v4 */
  --color-background: var(--background);
  /* ... */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

@theme {
  /* (optionnel) extensions : durations, custom spacings, --font-display */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  /* ... */
}
```

## Règles par section DESIGN.md

| Section | Émission |
|---|---|
| 1. Visual Theme | Commentaire en-tête `/* Theme: <H1> — <category> */` (informatif) |
| 2. Color | `:root` + `.dark` (tokens OKLCH) + bloc `@theme inline` (mappings color-*) |
| 3. Typography | `--font-sans`, `--font-mono` dans `:root` ; `--font-display` etc. dans bloc `@theme` |
| 4. Spacing & Grid | `--spacing` dans `@theme` SEULEMENT si delta vs défaut Tailwind |
| 5. Layout | Rien |
| 6. Components | `--radius` dans `:root` (obligatoire) ; éventuels `--shadow-*` dans `@theme` |
| 7. Motion | `--duration-*` et `--ease-*` dans `@theme` si non vide |
| 8. Voice & Brand | Commentaire `/* Voice: <résumé> */` |
| 9. Anti-patterns | Rien (utilisé par refine) |

## `@theme inline` vs `@theme` — la différence

- **`@theme inline`** : Tailwind résout `var(--x)` au moment de la cascade. Marche avec les swaps light/dark. Utilisé pour TOUS les tokens shadcn (color-*, radius-*, font-*).
- **`@theme`** (non-inline) : Tailwind compile la valeur statique au build. Utilisé pour les extensions invariantes (durations, spacings custom).

## Bloc `@theme inline` complet (toujours identique, 24 mappings)

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

Ce bloc est **constant** — l'agent l'émet tel quel à chaque génération, sans réfléchir.

## Worked example (Stripe-inspired)

Voir `references/design-md-schema.md` pour le DESIGN.md complet. Le `globals.css` produit :

```css
/* Theme: Stripe-inspired — Fintech */
/* Voice: Direct, technique mais accessible. */
@import 'tailwindcss';

:root {
  --background: oklch(1.000 0.000 0);
  --foreground: oklch(0.260 0.060 251);
  --card: oklch(1.000 0.000 0);
  --card-foreground: oklch(0.260 0.060 251);
  --popover: oklch(1.000 0.000 0);
  --popover-foreground: oklch(0.260 0.060 251);
  --primary: oklch(0.578 0.235 278);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.580 0.221 19);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.375rem;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

.dark {
  --background: oklch(0.260 0.060 251);
  --foreground: oklch(0.981 0.005 248);
  --card: oklch(0.260 0.060 251);
  --card-foreground: oklch(0.981 0.005 248);
  --popover: oklch(0.260 0.060 251);
  --popover-foreground: oklch(0.981 0.005 248);
  --primary: oklch(0.758 0.128 283);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.697 0.196 15);
  --destructive-foreground: oklch(0.205 0 0);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

@theme {
  --duration-fast: 150ms;
  --duration-base: 250ms;
}
```

## Ordre d'émission strict

1. Commentaires d'en-tête (Theme + Voice)
2. `@import 'tailwindcss';`
3. `:root { ... }` (22 tokens, primary/destructive depuis DS, le reste dérivé via `shadcn-tokens.md`)
4. `.dark { ... }` (19 tokens couleurs ; `--radius`, `--font-sans`, `--font-mono` restent au `:root`)
5. `@theme inline { ... }` (24 mappings invariants, voir bloc complet plus haut)
6. (optionnel) `@theme { ... }` (extensions : motion, spacing, font-display)

Ne JAMAIS sortir de cet ordre.
