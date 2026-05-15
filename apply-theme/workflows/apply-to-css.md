# Workflow `apply-to-css`

Transforme `designs/active.md` en `src/styles/globals.css`. Utilisé en standalone (mode `apply-only`) ou comme étape finale par tous les autres workflows.

## Pré-requis

`designs/active.md` existe et est complet (9 sections, palettes light + dark). Si pas le cas, ce workflow n'est pas celui à utiliser.

## Checklist forced-order

```
STEP 1 — Read designs/active.md
STEP 1.5 — Sanity checks pré-conversion
STEP 4 — Dériver le contenu de globals.css
STEP 5 — Write src/styles/globals.css, puis Read pour vérifier
STEP 6 — Reporter à l'user (4 lignes)
```

(Pas de STEP 2/3 ici puisqu'on n'écrit pas `designs/active.md` dans ce workflow.)

## STEP 1 — Read DESIGN.md

```
Read designs/active.md
```

Charger tout le contenu en mémoire.

## STEP 1.5 — Sanity checks

Format de référence : [`references/design-md-schema.md`](../references/design-md-schema.md). Vérifier dans l'ordre, abort dès la première erreur :

1. **H1** : la première ligne commence par `# ` (préfixe « Design System Inspired by » suggéré mais pas enforced).
2. **Category** : la seconde ligne commence par `> Category:`.
3. **9 H2 numérotés présents, ordre strict** : grep exact matches dans l'ordre :
   - `^## 1\. Visual Theme & Atmosphere$`
   - `^## 2\. Color Palette & Roles$`
   - `^## 3\. Typography Rules$`
   - `^## 4\. Component Stylings$`
   - `^## 5\. Layout Principles$`
   - `^## 6\. Depth & Elevation$`
   - `^## 7\. Do's and Don'ts$`
   - `^## 8\. Responsive Behavior$`
   - `^## 9\. Agent Prompt Guide$`
4. **Section 2 sub-structure** : dans le bloc entre `## 2. Color Palette & Roles` et `## 3. Typography Rules`, présence de :
   - un `### Primary Brand` (ou variante case-insensitive `### Primary` / `### Brand`)
   - un `### Dark Mode` (case-insensitive)
5. **Au moins 1 hex/rgba/oklch dans `### Primary Brand`** entre backticks.
6. **Au moins 4 hex/rgba/oklch dans `### Dark Mode`** entre backticks (regex `#[0-9a-fA-F]{3,8}` | `rgba?\(` | `oklch\(`).

Si check 1, 2, 3, 4, ou 5 échoue :
```
❌ designs/active.md non conforme : <raison précise>.
Corrige le fichier ou relance avec un workflow de création/refine.
Cf. references/design-md-schema.md pour le format canonique open-design.
```

Si check 6 échoue :
```
❌ Pas de palette dark dans designs/active.md (moins de 4 couleurs dans "### Dark Mode").

shadcn impose un bloc .dark dans globals.css. Choix :
1. Fournis les hex dark pour primary, background, foreground, destructive
2. (non disponible v1) Auto-derive
3. Abandon
```

Attendre une réponse user avant de continuer.

## STEP 4 — Dériver globals.css

Référencer en parallèle :
- [`references/design-md-schema.md`](../references/design-md-schema.md) pour le mapping rich Color section → shadcn tokens
- [`references/css-mapping.md`](../references/css-mapping.md) pour la structure du fichier
- [`references/oklch-conversion.md`](../references/oklch-conversion.md) pour la conversion (script `tools/oklch.mjs`)
- [`references/shadcn-tokens.md`](../references/shadcn-tokens.md) pour les tokens non explicites + défauts shadcn

### 4a. Extraction des couleurs depuis section 2

Parcourir `## 2. Color Palette & Roles` sous-bloc par sous-bloc.

**Light scope** (tout sauf `### Dark Mode`) :

| Shadcn token | Source | Règle d'extraction |
|---|---|---|
| `--primary` | `### Primary Brand` | premier hex/rgba/oklch entre backticks |
| `--background` | `### Neutrals`, puce name contient « canvas » / « background » / « page » | sinon première puce de Neutrals |
| `--card` | `### Neutrals`, puce « Surface » / « Card » | sinon = `--background` |
| `--popover` | `### Neutrals`, puce « Popover » / « Menu » | sinon = `--card` |
| `--foreground` | `### Text`, puce « Title » / « Primary » | sinon première puce de Text |
| `--muted-foreground` | `### Text`, puce « Paragraph » / « Secondary » / « Description » | sinon défaut shadcn |
| `--destructive` | `### Semantic`, puce « Danger » / « Destructive » / « Error » | si prose mentionne « danger reuses primary » → = `--primary` ; sinon défaut shadcn rouge |
| `--border` | `### Neutrals`, puce « Separator » / « Border » | sinon défaut shadcn |
| `--input` | idem `--border` | sinon = `--border` |
| `--ring` | non extrait | défaut shadcn gris neutre |

**Dark scope** (uniquement sous `### Dark Mode`) : mêmes règles appliquées exclusivement à ce sous-bloc. Si une puce manque, fallback aux défauts shadcn dark — jamais dérivation depuis light.

### 4b. Conversion batch en OKLCH

Une fois les valeurs extraites (light + dark dans l'ordre des tokens), lancer un appel batch unique :

```sh
node .claude/skills/apply-theme/tools/oklch.mjs "#hex1" "rgba(...)" ...
```

Le script supporte hex et rgba. Récupérer la sortie ligne par ligne et mapper aux noms de tokens. **Ne jamais calculer OKLCH à la main**.

> **Note alpha** : si une valeur source est en rgba avec alpha < 1 (typique des `### Text` : `rgba(0,0,0,0.80)`) ou des `### Dark Mode` borders (`rgba(255,255,255,0.10)`), le script perd l'alpha. Pour ces cas v1, émettre directement `oklch(L 0 0 / A)` à la main (chroma 0 pour les noirs/blancs translucides) sans passer par le script. Tailwind v4 accepte oklch avec alpha en syntax `oklch(L C H / <alpha>%)`.

### 4c. Dérivation des tokens non explicites

Pour chaque token shadcn absent de DESIGN.md : appliquer les règles de [`references/shadcn-tokens.md`](../references/shadcn-tokens.md) :
- Paires `*-foreground` : seuil L > 0.65 → noir, sinon blanc
- `secondary`, `muted`, `accent` : défauts neutral shadcn
- Charts (5) et sidebar (8) : défauts shadcn (pas extraits de DESIGN.md en v1)
- `--ring` : défaut gris neutre (jamais dérivé du primary)

### 4d. Lectures complémentaires

- `--radius` : depuis `## 4. Component Stylings` (mention `border-radius: 12px` ou `Radius: 0.5rem` dans `### Buttons` ou `### Cards`). Défaut `0.625rem` si absent.
- `--font-sans`, `--font-mono`, `--font-heading` : depuis `## 3. Typography Rules` (premier stack crédible dans `### Font Family` ou équivalent). Défauts skill si absents.

### 4e. Émission

1. Commentaire d'en-tête : `/* Theme: <H1nettoyé> — <Category> */` puis `/* Voice: <résumé section 9, une phrase> */`.
2. `@import 'tailwindcss';`.
3. Bloc `:root` (32 tokens : 18 core + 5 chart + 8 sidebar + 1 radius, plus 3 fonts stacks).
4. Bloc `.dark` (31 tokens couleurs : 18 core + 5 chart + 8 sidebar — radius et fonts restent au `:root`).
5. Bloc `@theme inline` (44 mappings invariants, copier-coller depuis [`css-mapping.md`](../references/css-mapping.md)).
6. (optionnel) Bloc `@theme { ... }` : si on a parsé en prose des durations explicites en section 6 (« hover transitions 200ms ») → émettre `--duration-base: 200ms` ; si la section 3 mentionne un stack `display` → ajouter `--font-display`. Sinon pas de bloc.

## STEP 5 — Write + verify

```
Write src/styles/globals.css <contenu produit>
Read src/styles/globals.css
```

Sur le contenu relu, vérifier :
- Première ligne : commentaire `/* Theme: ... */`
- Présence de `@import 'tailwindcss';`
- `:root { ... }` contient les 32 tokens (18 core + 5 chart + 8 sidebar + 1 radius) + 3 fonts
- `.dark { ... }` contient les 31 tokens couleurs (18 core + 5 chart + 8 sidebar)
- `@theme inline { ... }` contient les 44 mappings
- Toutes les valeurs couleur sont en `oklch(...)` (pas de `hsl()`, pas de `#`)

Si une vérification échoue : corriger via `Edit` ciblé, re-vérifier.

## STEP 6 — Report user (4 lignes max)

```
✓ designs/active.md lu (<H1> — <category>)
✓ src/styles/globals.css écrit (32 tokens × 2 scopes, OKLCH)
→ Lance `pnpm dev` et ouvre /showcase pour valider
→ Itère via conversation ("primary plus chaud", "radius plus grand"...)
```

## Interdits

- Modifier `designs/active.md` dans ce workflow (passer par `refine.md` pour ça)
- Écrire ailleurs que `src/styles/globals.css`
- Skip STEP 5 (read-after-write)
