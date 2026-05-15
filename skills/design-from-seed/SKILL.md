---
name: design-from-seed
description: |
  Copie un seed open-design (claude / cohere / mistral-ai) depuis _shared/seeds/
  vers designs/active.md. Optionnel : applique 1-2 tweaks ciblés décrits par
  l'user (ex : "remplace l'accent par #df1b41", "passe le radius à 4px"). Sortie
  prête à être consommée par `design-apply`. Trigger : "from seed", "comme
  claude", "inspired by mistral", "copie le seed cohere".
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash(ls:*)
od:
  mode: design-system
  category: design-systems
  design_system:
    requires: false
    generates: true
  inputs:
    primary: seed_name
  outputs:
    primary: designs/active.md
---

# Skill `design-from-seed`

Tu produis un `designs/active.md` en copiant un seed depuis `skills/_shared/seeds/`, avec éventuellement quelques tweaks ciblés. Workflow simple : pick → copy → optional edit → write → suggest next.

## Background

Pourquoi 3 seeds (claude, cohere, mistral-ai) et pas les 71 du repo open-design ? Petit catalogue intentionnel : un seed light-warm-editorial (claude), un seed brand-driven AI (cohere), un seed mid-saturation product (mistral-ai). Ces 3 couvrent 80% des références qu'un user va invoquer en démarrage projet. L'import en bulk est différé jusqu'à validation du pipeline `from-seed → apply` end-to-end.

## Invariants

- Écrit **un seul fichier** : `designs/active.md` à la racine du cwd.
- Ne touche **jamais** : `globals.css`, `tailwind.config.*`, `.tsx`, ni les seeds eux-mêmes (`_shared/seeds/*.md` est lecture seule — ne pas modifier le master).
- Si `designs/active.md` existe déjà → demander confirmation avant overwrite.
- Les tweaks demandés par l'user sont appliqués **après** la copie, via Edit ciblé sur la copie. Jamais de réécriture du seed entier.

## Référence

- [`skills/_shared/seeds/`](../_shared/seeds/) — catalogue des seeds disponibles
- [`skills/_shared/design-md-schema.md`](../_shared/design-md-schema.md) — format DESIGN.md (utile si l'user décrit un tweak ambigu)

## STEP 1 — Identifier le seed

Trois cas selon l'input user :

**Cas A : nom de seed explicite** ("from seed claude", "comme cohere", "copie mistral-ai") :
- Vérifier l'existence : `ls skills/_shared/seeds/<nom>.md`
- Si trouvé → STEP 2 avec ce path.
- Si pas trouvé → STEP 1 cas C (lister + demander).

**Cas B : référence implicite à une marque** ("comme Anthropic", "inspired by Stripe", "in the style of Mistral") :
- Mapping souple :
  - "Anthropic" / "claude" → `claude.md`
  - "Mistral" / "Mistral AI" → `mistral-ai.md`
  - "Cohere" → `cohere.md`
- Si match → STEP 2.
- Sinon → STEP 1 cas C.

**Cas C : pas de nom, ou nom inconnu** :
- Lister les seeds disponibles + demander à l'user :

```
Seeds disponibles dans skills/_shared/seeds/ :
- claude — AI & LLM, warm editorial, terracotta accent
- cohere — Developer Tools / AI, clean technical, indigo brand
- mistral-ai — AI & LLM, mid-saturation product, orange accent

Lequel tu veux ? (Si tu cherches autre chose, utilise `design-from-brief` ou `design-from-screenshot`.)
```

Attendre la réponse user. Ne pas deviner.

## STEP 2 — Vérifier qu'aucun designs/active.md existant ne sera écrasé

```
ls designs/active.md
```

Si présent :
```
designs/active.md existe déjà. Tu veux :
1. L'écraser avec le seed <nom> (perte du contenu actuel)
2. Annuler (pour modifier l'existant, utilise `design-refine`)
```

Attendre confirmation explicite avant STEP 3.

Si absent → STEP 3 direct.

## STEP 3 — Copier le seed

```
Read skills/_shared/seeds/<nom>.md
Write designs/active.md <contenu lu, verbatim>
```

Pas de transformation. Le seed est livré tel quel — c'est le format open-design canonique, déjà valide pour `design-apply`.

## STEP 4 — Tweaks optionnels

Si l'user a mentionné des tweaks dans son input initial (ex : "from seed claude mais accent en `#df1b41`", "comme cohere avec radius 4px"), les appliquer maintenant **via Edit ciblé** sur `designs/active.md` (pas re-Write).

Tweaks typiques supportés :

| Demande user | Edit cible |
|---|---|
| "accent en `#XXX`" | Section 2 → sub-bloc Primary/Brand → premier bullet, remplacer la valeur entre backticks |
| "radius Xpx" | Section 4 → sous-bloc Buttons (ou Cards) → mention `Radius:` |
| "fond plus sombre" | Section 2 → Surface/Background bullet → préciser que c'est ambigu, demander une valeur hex précise plutôt que deviner |
| "font sans en X" | Section 3 → `### Font Family` → bullet Body/UI |

**Limite** : si le tweak est vague ("plus warm", "plus moderne") ou demande de toucher >2 sub-blocs → arrêter, suggérer `design-refine` qui est conçu pour ça.

```
Le tweak "plus moderne" touche plusieurs dimensions (palette, typo, radius...).
Je copie le seed claude verbatim et tu peux ensuite appeler `design-refine`
pour des ajustements ciblés. OK ?
```

## STEP 5 — Report user (4 lignes max)

```
✓ designs/active.md écrit depuis seed `<nom>` (<H1 du seed>)
✓ Tweaks appliqués : <liste des Edit, ou "aucun">
→ Vérifie le rendu : `design-apply` pour générer src/styles/globals.css
→ Pour ajuster : `design-refine` ("primary plus chaud", "radius plus grand"...)
```

## Anti-patterns à éviter

- **Modifier `_shared/seeds/*.md`** : c'est le master immuable. Toute modif va dans `designs/active.md`.
- **Réécrire le seed à la place de copier** : perte de fidélité. Le seed est testé, validé open-design — copier verbatim.
- **Appliquer >2 tweaks complexes ici** : c'est le rôle de `design-refine`. Ce skill fait du copy-with-light-edit, pas du refactor.
- **Skip la confirmation overwrite** : si `designs/active.md` existait, l'user a peut-être un travail en cours.
- **Deviner un seed sur match flou** : si "comme Notion" est demandé et qu'il n'y a pas de seed Notion, lister les seeds dispo plutôt qu'inventer un mapping.
