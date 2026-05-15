---
name: design-apply
description: |
  Lit un DESIGN.md (format open-design 9 sections) et émet un globals.css shadcn
  (Tailwind v4, style new-york-v4, baseColor neutral). Conversion mécanique
  DESIGN.md → CSS canonique : 32 tokens × 2 scopes en OKLCH, sans toucher à
  tailwind.config ni aux composants. Trigger : "apply theme", "génère le CSS",
  "regenerate globals.css", "passe le design en shadcn".
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash(node:*)
  - Bash(ls:*)
od:
  mode: design-system
  category: design-systems
  design_system:
    requires: true
    sections: [color-palette, typography, components]
  inputs:
    primary: designs/active.md
  outputs:
    primary: src/styles/globals.css
---

# Skill `design-apply`

Tu lis un DESIGN.md (format open-design 9 sections H2 numérotées) et tu produis le `globals.css` shadcn correspondant. Mécanique pure : pas de jugement créatif, pas de routing, pas de modification du DESIGN.md.

## Invariants (jamais violer)

- Écrit **un seul fichier** : `globals.css` à l'emplacement fourni (default `src/styles/globals.css`, depuis cwd). Override par argument naturel ("écris dans tmp/preview.css").
- Lecture seule sur le DESIGN.md. **Jamais** de Write sur `designs/active.md` (passer par `design-refine` pour ça).
- Ne touche **jamais** : `tailwind.config.*`, `.tsx`, `package.json`, `components.json`, ou tout autre fichier.
- Ordre forcé : Read DESIGN.md → sanity check → extraction → conversion OKLCH → composition → Write → read-after-write verify → report.
- Toutes les couleurs en `oklch(...)` dans `:root` / `.dark`. Jamais de `hsl()`, jamais de `#` direct.

## Références à charger

- [`skills/_shared/design-md-schema.md`](../_shared/design-md-schema.md) — format DESIGN.md (9 sections, H2 numérotés strict, wording lenient)
- [`skills/_shared/shadcn/tokens.md`](../_shared/shadcn/tokens.md) — 32 tokens canoniques + règles de dérivation
- [`skills/_shared/shadcn/css-mapping.md`](../_shared/shadcn/css-mapping.md) — structure complète du fichier produit + bloc `@theme inline` constant + ordre d'émission
- [`skills/_shared/shadcn/oklch-conversion.md`](../_shared/shadcn/oklch-conversion.md) — usage du script + cas alpha
- [`skills/_shared/tools/oklch.mjs`](../_shared/tools/oklch.mjs) — convertisseur déterministe hex/rgba → OKLCH

## STEP 1 — Read DESIGN.md

```
Read designs/active.md   (ou path passé en argument)
```

Si absent :

```
❌ <path> introuvable. Crée d'abord un DESIGN.md via :
   - `design-from-seed` (copie un seed claude/cohere/mistral-ai)
   - `design-from-brief` (depuis un brief texte)
   - `design-from-screenshot` (depuis une image)
```

Pas de Write. Stop.

## STEP 2 — Sanity checks

Format de référence : [`_shared/design-md-schema.md`](../_shared/design-md-schema.md). Abort à la première erreur :

1. **H1 présent** : la première ligne commence par `# `.
2. **9 H2 numérotés présents et dans l'ordre**. Numérotation strict, wording lenient :
   - `^## 1\. ` (Visual Theme & Atmosphere)
   - `^## 2\. ` (Color Palette & Roles) — bloquant
   - `^## 3\. ` (Typography Rules)
   - `^## 4\. ` (Component Stylings)
   - `^## 5\. ` à `^## 9\. ` — présence seule, pas de wording check
3. **Section 2 contient ≥1 valeur couleur** entre backticks (regex sur hex `` `#[0-9a-fA-F]{3,8}` ``, rgba `` `rgba?\( ``, oklch `` `oklch\( ``).

Sur échec :

```
❌ designs/active.md non conforme au schéma open-design : <raison précise>.
   Cf. skills/_shared/design-md-schema.md pour le format canonique.
   Pour corriger : `design-refine` (modif ciblée) ou `design-from-*` (réécriture).
```

## STEP 3 — Extraction Section 2 → tokens shadcn

Parcours **bullet par bullet** du bloc Section 2 (pas regex strict sur sub-headings — keyword matching tolérant). Référence : table « Règles par section DESIGN.md » dans [`css-mapping.md`](../_shared/shadcn/css-mapping.md) + table tokens dans [`tokens.md`](../_shared/shadcn/tokens.md).

### 3a. Mapping light scope (tout sauf `### Dark Mode`)

| Token shadcn | Patterns de match (case-insensitive, par bullet name) |
|---|---|
| `--primary` | sub-heading "Primary" → premier bullet hex/rgba/oklch ; OR bullet name contient "Brand" |
| `--background` | bullet name contient "canvas", "background", "page", "parchment" — premier match dans Surface/Neutrals |
| `--card` | bullet name contient "card", "container", "ivory", "elevated" ; sinon = `--background` |
| `--popover` | bullet name contient "popover", "menu", "dropdown" ; sinon = `--card` |
| `--foreground` | bullet name contient "title", "primary text", "headline", "near black", "ink" |
| `--muted-foreground` | bullet name contient "paragraph", "secondary text", "olive", "stone gray" |
| `--destructive` | bullet name contient "danger", "error", "destructive", "crimson" ; sinon défaut shadcn |
| `--border` | bullet name contient "border", "separator" — premier match light ; sinon défaut |
| `--input` | bullet name contient "input border" ; sinon = `--border` |
| `--ring` | bullet name contient "focus ring", "ring blue" ; sinon défaut shadcn neutre |
| `--accent` | bullet name contient "accent", "coral", "secondary brand" ; sinon défaut neutral |
| `--secondary` | bullet name contient "secondary", "warm sand", "button" ; sinon défaut neutral |
| `--muted` | défaut neutral si non explicite |

Pour les `*-foreground` non explicites : règle de dérivation `tokens.md` — seuil L > 0.65 sur le token de base → foreground `oklch(0.205 0 0)` (presque noir), sinon `oklch(0.985 0 0)` (presque blanc).

Charts (5) et sidebar (8) : défauts shadcn (cf. tableaux §2 et §3 de `tokens.md`). Jamais extraits du DESIGN.md en v1.

### 3b. Mapping dark scope

**Si `### Dark Mode` présent** (H3 case-insensitive contenant "dark") : extraction analogue dans ce sous-bloc, **sans fallback inter-scope** (le light n'alimente jamais le dark).

**Si absent → dériver un dark depuis le light** :
- `--background` dark = `oklch(0.145 0 0)` (défaut shadcn neutral)
- `--foreground` dark = `oklch(0.985 0 0)`
- `--card` / `--popover` dark = `oklch(0.205 0 0)` (delta +0.06 L vs background dark — pattern vanilla)
- `--card-foreground` / `--popover-foreground` dark = `oklch(0.985 0 0)`
- `--primary` dark = boost L de +0.18 sur le primary light (garder hue + chroma). Si primary light est neutre (chroma 0) → `oklch(0.922 0 0)`.
- `--primary-foreground` dark : règle paire (seuil L > 0.65)
- `--secondary` / `--muted` / `--accent` dark = `oklch(0.269 0 0)` ; foregrounds = `oklch(0.985 0 0)`
- `--muted-foreground` dark = `oklch(0.708 0 0)`
- `--destructive` dark = `oklch(0.704 0.191 22.216)` (défaut vanilla)
- `--border` dark = `oklch(1 0 0 / 10%)` (pattern alpha vanilla)
- `--input` dark = `oklch(1 0 0 / 15%)`
- `--ring` dark = `oklch(0.556 0 0)`
- Charts dark + sidebar dark = défauts vanilla (tableaux `tokens.md`)

→ Annoncer la dérivation dans le STEP 7 report.

### 3c. Lectures complémentaires (autres sections)

- `--radius` : depuis `## 4. Component Stylings`. Chercher mention `border-radius: Xpx` ou `Radius: X` dans Buttons/Cards. Convertir en rem si nécessaire (`8px` → `0.5rem`). Défaut `0.625rem` si absent.
- `--font-sans` / `--font-mono` / `--font-heading` : depuis `## 3. Typography Rules`, sub-heading `### Font Family` (ou équivalent). Extraire le premier stack crédible. Défauts skill si absents (cf. `tokens.md` §4).
- Durations motion : depuis `## 6. Depth & Elevation`. Si la section mentionne explicitement « hover transitions 200ms » ou similaire → marquer pour émission `@theme { --duration-* }`. Sinon rien.

## STEP 4 — Conversion batch OKLCH

Lister TOUTES les valeurs hex/rgba à convertir (light + dark dans l'ordre des tokens). Un seul appel batch :

```sh
node skills/_shared/tools/oklch.mjs "#hex1" "#hex2" "rgb(...)" ...
```

Mapper la sortie ligne par ligne aux noms de tokens. **Jamais calculer OKLCH à la main.**

Cas particuliers (cf. [`oklch-conversion.md`](../_shared/shadcn/oklch-conversion.md)) :
- **Valeur déjà en OKLCH** dans le DESIGN.md → passthrough direct, pas d'appel script.
- **rgba avec alpha < 1** (ex `rgba(0,0,0,0.80)` pour Title text, `rgba(255,255,255,0.10)` pour borders dark) : le script perd l'alpha. Émettre manuellement `oklch(L 0 0 / A%)` (chroma 0 pour noirs/blancs translucides). Pour rgba colorés translucides : passer la couleur sans alpha au script puis recoller `/ A%` à la sortie.

## STEP 5 — Composition CSS

Référence stricte : « Ordre d'émission strict » dans [`css-mapping.md`](../_shared/shadcn/css-mapping.md). 8 blocs dans l'ordre exact :

1. Commentaires d'en-tête : `/* Theme: <H1 nettoyé> — <Category> */` puis `/* Voice: <résumé Section 9, une phrase> */`
2. `@import 'tailwindcss';`
3. `@custom-variant dark (&:is(.dark *));`
4. `:root { ... }` — **36 entrées** : 1 radius + 19 core + 5 chart + 8 sidebar + 3 fonts
5. `.dark { ... }` — **32 entrées** : 19 core + 5 chart + 8 sidebar (radius et fonts restent au `:root`)
6. `@theme inline { ... }` — **42 mappings invariants**. **Copier-coller direct** depuis le bloc canonique de [`css-mapping.md`](../_shared/shadcn/css-mapping.md) — ce bloc est constant à chaque génération, ne pas réfléchir token par token.
7. (optionnel) `@theme { ... }` — émis SEULEMENT si STEP 3c a marqué des durations explicites. Format minimal : `--duration-fast: 150ms; --duration-base: 250ms;`
8. `@layer base { ... }` — `border-border` par défaut + `bg-background text-foreground` sur body. Bloc constant :

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Ne JAMAIS sortir de cet ordre. Le `globals.css` produit est déterministe pour un DESIGN.md donné.

## STEP 6 — Write + read-after-write verify

```
Write <output_path> <contenu produit>
Read <output_path>
```

Sur le contenu relu, vérifier :
- Première ligne : commentaire `/* Theme: ... */`
- Présence de `@import 'tailwindcss';`, `@custom-variant dark`, `:root`, `.dark`, `@theme inline`, `@layer base`
- `:root { ... }` contient 36 entrées (compter les lignes `--xxx:` dans le bloc)
- `.dark { ... }` contient 32 entrées
- `@theme inline { ... }` contient 42 mappings
- Toutes les valeurs couleur sont en `oklch(...)` (grep négatif sur `hsl(` et sur `#[0-9a-fA-F]{3,8}` à l'intérieur des blocs `:root` / `.dark`)

Si une vérification échoue : **Edit ciblé** sur la ligne fautive + re-Read pour re-vérifier. Pas de re-Write complet.

## STEP 7 — Report user (4 lignes max)

```
✓ <DESIGN.md path> lu (<H1> — <category>) — 9 sections OK, <N> couleurs Section 2
✓ <globals.css path> écrit — 32 tokens × 2 scopes en OKLCH, dark <auto-dérivé|extrait du DESIGN.md>
→ Lance `pnpm dev` et teste light + dark (toggle classe `.dark` sur <html>)
→ Pour itérer : `design-refine` ("primary plus chaud", "radius plus grand"...)
```

Si le dark a été auto-dérivé : insister dans la ligne 2 et suggérer `design-refine` pour ajuster.

## Anti-patterns à éviter

- **Skipper STEP 6** (read-after-write) : non-négociable. Force une boucle disque qui empêche de "deviner" le contenu.
- **Calculer OKLCH à la main** : interdit. Toujours passer par le script.
- **Inventer des tokens shadcn** : les 32 tokens canoniques sont fixes (cf. `tokens.md`). Pas d'ajout custom dans `:root`/`.dark` sauf si DESIGN.md le justifie via `@theme {...}` (durations).
- **Modifier `designs/active.md`** : ce skill est lecture seule sur l'input. Pour modifier → `design-refine`.
- **Refuser un DESIGN.md sans dark** : v1 le faisait, on dérive maintenant (politique STEP 3b).
