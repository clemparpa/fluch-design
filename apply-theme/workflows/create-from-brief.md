# Workflow `create-from-brief`

Créer un `designs/active.md` complet depuis un brief texte de l'user (sans seed, sans screenshot, sans URL).

## Quand l'utiliser

L'user a fourni une description textuelle de ce qu'il veut, sans référence à une marque connue ni image. Exemples :
- "fais-moi un thème éditorial chaud avec accent terracotta"
- "design system minimal noir et blanc, typo serif"
- "thème jeu vidéo cyberpunk avec accents néon"

Si l'user mentionne une marque (« comme stripe ») → `create-from-seed.md`.
Si l'user joint une image → `create-from-screenshot.md`.

## Checklist forced-order

```
STEP 0 — Si designs/active.md existe, confirmer overwrite avec l'user
STEP 1 — Composer mentalement le DESIGN.md depuis le brief
STEP 2 — Écrire designs/active.md (9 sections, light + dark)
STEP 3 — Re-Read designs/active.md (audit trail)
STEP 4-6 — Charger workflows/apply-to-css.md à partir de STEP 4
```

## STEP 0 — Overwrite check

```
ls designs/active.md
```

Si existant :
```
designs/active.md existe déjà. Le brief que tu as donné va l'écraser entièrement.
Confirme l'overwrite ou demande un refine à la place.
```

Attendre confirmation.

## STEP 1 — Composition

Format cible : open-design canonique (cf. [`references/design-md-schema.md`](../references/design-md-schema.md)).

H1 + Category + tagline optionnel, puis les 9 sections numérotées.

### 1. Visual Theme & Atmosphere
3–4 paragraphes qui résument l'ambiance. Reformuler le brief de l'user dans le vocabulaire design (densité, contraste, mood, philosophie).

### 2. Color Palette & Roles — le plus délicat

Structure obligatoire : sous-headings `### Primary Brand` / `### Neutrals` / `### Text` / `### Semantic` / `### Dark Mode`. Items au format `- **<Name>** (\`<hex>\`): <rôle>.`.

L'user peut donner :
- **Hex explicites** : `"primary #ff5500"` → utiliser tels quels dans `### Primary Brand`.
- **Adjectifs colorés** : « terracotta », « soft pink », « navy » → inférer un hex plausible (signaler à l'user que c'est inféré).
- **Rien sur les couleurs** : demander à l'user au minimum 4 hex (primary, canvas/background, title/foreground, danger) pour light ET dark — ne PAS inventer 100% silencieusement.

Règle de prudence : **si plus de 50% des valeurs sont inférées**, lister les couleurs à l'user et demander confirmation avant Write :
```
J'ai inféré ces couleurs depuis ton brief :

### Primary Brand
- Primary: #d2691e (terracotta)

### Neutrals
- Canvas: #fff8f3
- Border: #efe6da

### Text
- Title: #2b1810

### Semantic
- Danger: #c0392b

### Dark Mode
- Canvas: #1a0e08
- Title: #fff8f3
- Primary: #f4a460
- Danger: #e74c3c

OK ou tu corriges ?
```

Minimum à fournir pour passer les sanity checks : 1 hex dans `### Primary Brand` + 4 valeurs dans `### Dark Mode`.

### 3. Typography Rules
Sous-blocs `### Font Family` (sans / mono / heading), `### Hiérarchie` (optionnel), `### Principes`.
- Si l'user mentionne explicitement une famille (« typo serif », « Inter », etc.) → utiliser.
- Sinon défaut Inter (sans + heading) + JetBrains (mono).

### 4. Component Stylings
Sous-blocs `### Buttons`, `### Cards`, `### Inputs`. Mentionner explicitement un radius :
- « soft », « warm », « friendly » → 0.5–0.75rem
- « modern », « tech » → 0.375–0.5rem
- « brutalist », « raw » → 0 ou 0.125rem
- « luxe », « editorial » → 0.25rem

### 5. Layout Principles
2–3 phrases de patterns inférés depuis le mood (cards à plat, hero centré, grille dense, masonry...).

### 6. Depth & Elevation
Tableau ou liste de 2–3 niveaux de shadow + mention de motion. Si rien de mentionné → flat par défaut + transitions ~200ms.

### 7. Do's and Don'ts
Sous-listes obligatoires `### Do` et `### Don't`. Inférer 3–5 items dans chaque. Ex: un thème « minimaliste » → Don't « pas de gradients », « pas de shadows lourdes ».

### 8. Responsive Behavior
2 phrases sur breakpoints + comportement mobile. Défaut Tailwind v4 (sm 640 / md 768 / lg 1024 / xl 1280) sauf cas particulier.

### 9. Agent Prompt Guide
Si l'user a donné un ton → reformuler en guide pour un LLM écrivant de la copie dans cette identité. Sinon défaut neutre (voix factuelle, deuxième personne sur les CTAs).

## STEP 1.5 — Dark mode

Si le brief ne précise pas le dark, **toujours demander** :

```
Le brief n'a pas précisé la palette dark. shadcn requiert un sous-bloc `### Dark Mode`
dans `## 2. Color Palette & Roles` avec au moins 4 couleurs.

Tu veux :
1. Me donner 4 hex pour le dark (au minimum : Canvas, Title, Primary, Danger)
2. Me laisser proposer un `### Dark Mode` cohérent avec le light, puis valider
3. Abandonner pour l'instant

(Auto-derive automatique pas disponible en v1.)
```

Si l'user choisit (2), proposer le bloc `### Dark Mode` et attendre validation avant STEP 2.

## STEP 2 — Écriture

Suivre `references/design-md-schema.md` pour le format exact (open-design canonique). Vérifier mentalement avant `Write` :
- H1 préfixé par « Design System Inspired by » (ou nom court créatif si v1 du skill ; à harmoniser pour contribuer à open-design)
- `> Category:` (deviner depuis le brief ou `Other`)
- Tagline optionnel ligne 3
- Les 9 H2 numérotés dans l'ordre exact (`## 1. Visual Theme & Atmosphere` … `## 9. Agent Prompt Guide`)
- Section 2 contient `### Primary Brand` (≥1 hex) ET `### Dark Mode` (≥4 hex)

```
Write designs/active.md <contenu complet>
```

## STEP 3 — Re-read

```
Read designs/active.md
```

Obligatoire.

## STEP 4-6

Charger `workflows/apply-to-css.md` à partir de STEP 4.

## Interdits

- Inventer 100% des couleurs sans confirmer avec l'user
- Skip le dark check
- Écrire globals.css avant designs/active.md
