# Mapping `DESIGN.md` → `globals.css`

Règles d'émission CSS depuis les 9 sections du DESIGN.md. Cible : `src/styles/globals.css`.

Cf. aussi [`oklch-conversion.md`](oklch-conversion.md) (conversion couleur) et [`tokens.md`](tokens.md) (tokens canoniques + règles de dérivation).

## Structure complète du fichier produit

```css
/* Theme: <H1> — <category> */
/* Voice: <résumé Voice & Brand section, une phrase> */
@import 'tailwindcss';
@custom-variant dark (&:is(.dark *));

:root {
  /* 32 tokens shadcn + radius en OKLCH, valeurs LIGHT
     (18 core + 5 chart + 8 sidebar + 1 radius)
     + 3 fonts stacks litéraux (Vite, pas Next.js) */
  --radius: 0.625rem;
  --background: oklch(...);
  /* ... */
  --font-sans: '...';
  --font-mono: '...';
  --font-heading: var(--font-sans);
}

.dark {
  /* 31 tokens couleurs en OKLCH, valeurs DARK
     (radius et fonts restent au scope :root) */
  --background: oklch(...);
  /* ... */
}

@theme inline {
  /* 42 mappings invariants pour Tailwind v4 — voir bloc canonique plus bas */
}

@theme {
  /* (optionnel) extensions statiques : durations, custom spacings.
     Émis SEULEMENT si DESIGN.md ## 6. Depth & Elevation mentionne des durées. */
  --duration-fast: 150ms;
  --duration-base: 250ms;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Pourquoi ces 3 blocs additionnels (vs vanilla simplifié)

- **`@custom-variant dark (&:is(.dark *));`** (ligne 4) : requis par Tailwind v4 pour que la classe `.dark` sur un ancêtre déclenche la variante `dark:` dans les utility classes. Sans ça, `.dark` est ignoré.
- **`@layer base { ... }`** (en bas) : applique `border-border` à tous les éléments par défaut + définit la couleur de fond / texte du `<body>`. Sans ça, les composants shadcn ont des bordures invisibles et le body reste blanc système.
- **`@theme { --duration-* }`** (entre `@theme inline` et `@layer base`) : optionnel. Émis seulement si DESIGN.md `## 6. Depth & Elevation` mentionne des durées explicites.

## Règles par section DESIGN.md

Format DESIGN.md = 9 H2 numérotées canoniques d'open-design (cf. [`../design-md-schema.md`](../design-md-schema.md)).

| H2 source | Émission |
|---|---|
| `## 1. Visual Theme & Atmosphere` | Commentaire en-tête `/* Theme: <H1> — <category> */` (informatif, pas de tokens) |
| `## 2. Color Palette & Roles` | `:root` + `.dark` : 19 core + 5 chart + 8 sidebar (tokens OKLCH). Le bloc `@theme inline` qui les remappe est constant et toujours émis. |
| `## 3. Typography Rules` | `--font-sans`, `--font-mono`, `--font-heading` dans `:root` (stacks litéraux extraits de la section). |
| `## 4. Component Stylings` | `--radius` dans `:root` (obligatoire — défaut `0.625rem` si non précisé). Éventuels `--shadow-*` custom dans `@theme` si la section décrit des shadows non standards. |
| `## 5. Layout Principles` | Rien. Le schéma open-design n'a pas de section Spacing dédiée ; les défauts Tailwind v4 sont hérités. Une mention prose de spacing custom peut être ignorée. |
| `## 6. Depth & Elevation` | `--duration-*` / `--ease-*` dans `@theme` SEULEMENT si la section mentionne des durées explicites (ex: « hover transitions 200ms »). Sinon rien — défauts Tailwind v4. |
| `## 7. Do's and Don'ts` | Rien (consommé par `design-refine` pour anti-pattern check, pas par `design-apply`). |
| `## 8. Responsive Behavior` | Rien. Tailwind v4 a `sm/md/lg/xl/2xl` natifs ; on n'émet pas de `--breakpoint-*` custom (cohérent avec vanilla `shadcn init`). |
| `## 9. Agent Prompt Guide` | Commentaire `/* Voice: <résumé une phrase> */` extrait de la section. Informatif. |

## `@theme inline` vs `@theme` — la différence

- **`@theme inline`** : Tailwind résout `var(--x)` au moment de la cascade. Marche avec les swaps light/dark. Utilisé pour TOUS les tokens shadcn qui ont une valeur différente en light vs dark (color-*, sidebar-*, chart-*, radius-*, font-*).
- **`@theme`** (non-inline) : Tailwind compile la valeur statique au build. Utilisé pour les extensions invariantes (durations, easings, spacings custom — valeurs qui ne changent pas avec `.dark`).

**Règle pour ajouter un token custom** : si la valeur doit swap avec `.dark` (couleur, radius variant) → la définir dans `:root` + `.dark` et la mapper dans `@theme inline` avec le préfixe Tailwind (`--color-success: var(--success)`). Si la valeur est constante (motion duration) → la mettre directement dans `@theme`.

## Bloc `@theme inline` canonique (42 mappings)

Ordre exact : fonts (extension Vite) → radius scale → colors core → charts → sidebar.

Décompte : 3 fonts + 7 radius + 19 colors + 5 charts + 8 sidebar = **42 mappings**.

```css
@theme inline {
  --font-sans: var(--font-sans);
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
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
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

Ce bloc est **constant** — l'agent l'émet tel quel à chaque génération, sans réfléchir.

### Écarts vs vanilla `shadcn init`

3 ajouts intentionnels par rapport à la sortie de `npx shadcn@latest init` :

1. **`--font-sans` / `--font-heading` / `--font-mono`** : vanilla ne les émet pas (Next.js les injecte via `next/font`). Sur Vite (notre cible), sans ces 3 mappings + définition `:root`, les classes `font-sans` / `font-mono` ne marchent pas.
2. **`--color-destructive-foreground`** : vanilla ne définit ni la var ni le mapping (les composants destructive utilisent `text-white` direct). On l'émet pour robustesse — si l'utilisateur override `--destructive`, la paire foreground reste cohérente même si un composant tiers la consomme.

Les 39 mappings restants sont strictement byte-equivalent à `shadcn init` (Tailwind v4, style `new-york-v4`, baseColor `neutral`).

> **Échelle radius multiplicative** : `--radius-sm` à `--radius-4xl` sont calculées par ratio (× 0.6, × 0.8, × 1, × 1.4, × 1.8, × 2.2, × 2.6). C'est la convention shadcn actuelle (pas une soustraction en px comme avant).

## Worked example (Stripe-inspired)

DESIGN.md complet : voir `references/design-md-schema.md`. Le `globals.css` produit (32 tokens × 2 scopes, fonts en `:root`, bloc `@theme inline` invariant, motion en `@theme`) :

```css
/* Theme: Stripe-inspired — Fintech */
/* Voice: Direct, technique mais accessible. */
@import 'tailwindcss';
@custom-variant dark (&:is(.dark *));

:root {
  /* Core 18 + radius */
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

  /* Charts (défauts shadcn neutral) */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* Sidebar (défauts shadcn neutral) */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* Fonts (Vite — émises ici, pas via next/font) */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-heading: var(--font-sans);
}

.dark {
  /* Core 18 (radius et fonts restent au :root) */
  --background: oklch(0.260 0.060 251);
  --foreground: oklch(0.981 0.005 248);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.981 0.005 248);
  --popover: oklch(0.205 0 0);
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
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);

  /* Charts dark */
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  /* Sidebar dark */
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --font-sans: var(--font-sans);
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
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
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@theme {
  --duration-fast: 150ms;
  --duration-base: 250ms;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Ordre d'émission strict

1. Commentaires d'en-tête (Theme + Voice)
2. `@import 'tailwindcss';`
3. `@custom-variant dark (&:is(.dark *));`
4. `:root { ... }` (1 radius + 19 core + 5 chart + 8 sidebar + 3 fonts = 36 entrées)
5. `.dark { ... }` (19 core + 5 chart + 8 sidebar = 32 entrées ; radius et fonts restent au `:root`)
6. `@theme inline { ... }` (42 mappings invariants, voir bloc complet plus haut)
7. (optionnel) `@theme { ... }` (extensions statiques : motion, spacing, etc.)
8. `@layer base { ... }` (border-border par défaut + bg/text body)

Ne JAMAIS sortir de cet ordre.
