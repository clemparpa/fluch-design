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

Vérifier dans l'ordre, abort dès la première erreur :

1. **H1 + Category** : la première ligne commence par `# `, la seconde par `> Category:`
2. **9 H2 présents** : chercher tous les `^## ` (regex). Doit en trouver les 9 attendus.
3. **Color avec Light + Dark** : dans la section `## Color`, présence de `Light:` ET `Dark:` (case-insensitive).
4. **4 hex minimum dans Dark** : sous `Dark:`, compter les occurrences de hex (`#[0-9a-fA-F]{6}`) ou de `oklch(...)`. Doit être ≥ 4.

Si check 1, 2, ou 3 échoue :
```
❌ designs/active.md non conforme : <raison précise>.
Corrige le fichier ou relance avec un workflow de création/refine.
```

Si check 4 échoue :
```
❌ Pas de palette dark dans designs/active.md (moins de 4 couleurs sous "Dark:").

shadcn impose un bloc .dark dans globals.css. Choix :
1. Fournis les hex dark pour primary, background, foreground, destructive
2. (non disponible v1) Auto-derive
3. Abandon
```

Attendre une réponse user avant de continuer.

## STEP 4 — Dériver globals.css

Référencer en parallèle :
- `references/css-mapping.md` pour la structure du fichier
- `references/oklch-conversion.md` pour les couleurs (utilisation du script `tools/oklch.mjs`)
- `references/shadcn-tokens.md` pour les tokens non explicites

Procédure :

1. Construire le commentaire d'en-tête depuis H1, Category, et résumé Voice & Brand
2. **Conversion couleurs en un appel batch** : lister tous les hex du DESIGN.md (light + dark dans l'ordre des tokens), puis :
   ```sh
   node .claude/skills/apply-theme/tools/oklch.mjs "#hex1" "#hex2" ...
   ```
   Récupérer la sortie ligne par ligne. **Ne jamais calculer OKLCH à la main** — utiliser le script (cf. `oklch-conversion.md`).
3. Pour chaque token shadcn non explicite : dériver selon `shadcn-tokens.md` (light scope, puis dark scope). Si la dérivation produit une couleur en hex (peu probable, plutôt en OKLCH direct), reconvertir via le script.
4. Lire `--radius` depuis section Components ; défaut `0.625rem` si absent
5. Lire `--font-sans` / `--font-mono` depuis section Typography ; défauts si absents
6. Émettre le bloc `:root` (22 tokens)
7. Émettre le bloc `.dark` (19 tokens couleurs uniquement — pas radius/fonts qui restent au :root)
8. Émettre le bloc `@theme inline` (24 mappings invariants, copier-coller depuis `css-mapping.md`)
9. Si section Motion non vide : émettre `@theme { --duration-* / --ease-* }`
10. Si section Typography contient `display` : ajouter `--font-display` dans `@theme`
11. Si section Spacing & Grid contient un delta vs défaut : ajouter `--spacing` dans `@theme`

## STEP 5 — Write + verify

```
Write src/styles/globals.css <contenu produit>
Read src/styles/globals.css
```

Sur le contenu relu, vérifier :
- Première ligne : commentaire `/* Theme: ... */`
- Présence de `@import 'tailwindcss';`
- `:root { ... }` contient les 22 tokens (grep chaque nom canonique)
- `.dark { ... }` contient les 19 tokens couleurs
- `@theme inline { ... }` contient les 24 mappings
- Toutes les valeurs couleur sont en `oklch(...)` (pas de `hsl()`, pas de `#`)

Si une vérification échoue : corriger via `Edit` ciblé, re-vérifier.

## STEP 6 — Report user (4 lignes max)

```
✓ designs/active.md lu (<H1> — <category>)
✓ src/styles/globals.css écrit (22 tokens × 2 scopes, OKLCH)
→ Lance `pnpm dev` et ouvre /showcase pour valider
→ Itère via conversation ("primary plus chaud", "radius plus grand"...)
```

## Interdits

- Modifier `designs/active.md` dans ce workflow (passer par `refine.md` pour ça)
- Écrire ailleurs que `src/styles/globals.css`
- Skip STEP 5 (read-after-write)
