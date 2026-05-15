---
name: design-refine
description: |
  Itère sur un DESIGN.md existant (designs/active.md) via demandes en langage
  naturel : "primary plus chaud", "radius plus grand", "fond plus sombre",
  "passe l'accent en #XXX". Edit ciblé sur les sections concernées (jamais
  Write complet). Garde-fou anti-AI-slop : refuse Tailwind indigo, gradient
  2-stops trust, etc. Ne touche JAMAIS au CSS — invoque `design-apply` ensuite
  pour matérialiser. Trigger : "refine", "ajuste le design", "change le primary".
allowed-tools:
  - Read
  - Edit
  - Glob
  - Grep
  - Bash(ls:*)
od:
  mode: design-system
  category: design-systems
  design_system:
    requires: true
    sections: [color-palette, typography, components]
  craft:
    requires: [anti-ai-slop, color]
  inputs:
    primary: designs/active.md
  outputs:
    primary: designs/active.md
---

# Skill `design-refine`

Tu modifies un `designs/active.md` existant via une demande user en langage naturel ("primary plus chaud", "radius plus grand", "passe l'accent en `#df1b41`"). **Edit ciblé** sur les sub-blocs concernés, jamais Write complet. Garde-fou anti-AI-slop avant d'appliquer.

Ce skill ne touche **jamais** au CSS. Pour matérialiser dans `globals.css`, l'user invoque `design-apply` après.

## Invariants (jamais violer)

- Modifie **un seul fichier** : `designs/active.md`. **Edit ciblé**, pas Write complet.
- Ne touche **jamais** : `src/styles/globals.css`, `tailwind.config.*`, `.tsx`, `package.json`, ni les seeds (`_shared/seeds/*.md` lecture seule).
- Préserve byte-pour-byte les 8 sections non touchées par la demande user.
- Ordre forcé : Read → identifier section cible → anti-pattern check → Edit → re-Read (audit) → report.
- Le report suggère **explicitement** `design-apply` comme prochain pas. **Ne pas auto-invoquer** `design-apply`.

## Références à charger

- [`skills/_shared/design-md-schema.md`](../_shared/design-md-schema.md) — format DESIGN.md (9 sections, sub-headings tolérants Section 2)
- [`skills/_shared/craft/anti-ai-slop.md`](../_shared/craft/anti-ai-slop.md) — 7 péchés cardinaux P0 (Tailwind indigo, gradient trust, emoji icons, etc.)
- [`skills/_shared/craft/color.md`](../_shared/craft/color.md) — palette structure (4 layers), accent discipline (≤2 uses/screen), contrast minimums, anti-defaults

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

Pas d'Edit. Stop.

## STEP 2 — Identifier la modif demandée

Mapping demande user → section cible (non exhaustif, format aligné sur le schéma open-design) :

| Demande user (intent) | Section cible | Type d'Edit |
|---|---|---|
| « primary plus chaud / froid » | `## 2.` → `### Primary` (ou `### Primary Brand`) | Décaler H de 30–60° en gardant L/C |
| « primary plus saturé » | `## 2.` → `### Primary` | Augmenter C de 0.05–0.10 |
| « primary plus pâle / soutenu » | `## 2.` → `### Primary` | Ajuster L de ±0.05 |
| « accent en `#XXX` » | `## 2.` → `### Accent` (ou Primary si pas d'accent dédié) | Replace valeur backtickée |
| « fond plus sombre / clair » (light) | `## 2.` → `### Surface & Background` ou `### Neutrals` | Baisser/monter L de 0.03–0.05 |
| « fond plus sombre » (dark) | `## 2.` → `### Dark Mode` ou bullets dark mélangés (Pattern A) | Idem dark scope |
| « plus de contraste » | `## 2.` → `### Text` vs `### Neutrals` | Écarter les L des deux pôles |
| « radius plus grand / petit » | `## 4.` → mention `Radius:` dans Buttons/Cards | Augmenter/baisser d'un cran |
| « pas de radius » / « carré » | `## 4.` → Radius | Mettre à 0 |
| « typo serif / sans / mono » | `## 3.` → `### Font Family` | Remplacer le stack |
| « anim plus rapide / lente » | `## 6.` → mention durations | Ajuster les ms |
| « pas d'anim » | `## 6.` | Mettre durations à 0 ou retirer mention |

**Demandes vagues** ("ça fait pas pro", "manque de chaleur", "plus moderne") → poser **une seule** question de clarification ciblée :

> "Tu veux ajuster la palette (couleurs), la typo, ou les radii en priorité ?"

Attendre la réponse avant STEP 3.

**Multi-demandes** ("primary plus chaud ET radius plus grand") : OK si les sections cibles sont **différentes** et qu'il y en a **≤2**. Si la demande touche >2 sub-blocs ou sections → arrêter, demander à décomposer :

> "Cette demande touche <N> aspects (palette, typo, radii). Je peux en traiter ≤2 par appel — tu veux qu'on commence par lequel ?"

## STEP 3 — Anti-pattern check à 2 étages

### 3a. Craft universel (anti-AI-slop, P0 bloquant)

Si la modif demandée matche un des **7 péchés cardinaux** de [`_shared/craft/anti-ai-slop.md`](../_shared/craft/anti-ai-slop.md), **bloquer** :

| Demande à bloquer | Règle violée |
|---|---|
| accent ∈ `{#6366f1, #4f46e5, #4338ca, #3730a3, #8b5cf6, #7c3aed, #a855f7}` | Cardinal sin #1 (Default Tailwind indigo) |
| « gradient hero purple→blue / blue→cyan / indigo→pink » | Cardinal sin #2 (two-stop trust gradient) |
| « emoji ✨🚀🎯⚡🔥💡 comme icône » dans Section 4 | Cardinal sin #3 (emoji as feature icons) |
| « accent partout » / « 5+ boutons accent » dans Section 7 | `color.md` accent discipline (≤2 uses/screen) |

Format de refus pour la liste indigo :

```
⚠️ La couleur demandée (`#6366f1`) est dans la liste anti-AI-slop P0 :
   « Default Tailwind indigo as accent » (cf. _shared/craft/anti-ai-slop.md).
   C'est le tell #1 d'une UI générée par LLM.

Suggestions :
- Bleu plus saturé : `#2f6feb`
- Rosy / coral : `#df1b41`
- Violet saturé non-flagged : `#a64ae3`

Si la marque exige vraiment indigo, confirme explicitement et je l'applique.
```

Attendre confirmation explicite si l'user insiste. Sinon : bloquer.

### 3b. Anti-pattern local (`## 7. Don't`, question)

Lire la sous-liste `### Don't` (variantes : `Don'ts`, `Avoid`, `Never`) de `## 7. Do's and Don'ts` du DESIGN.md actif. Si la modif contredit un anti-pattern listé :

```
⚠️ Ta demande contredit un Don't du DESIGN.md actif :
   « <texte verbatim de l'anti-pattern> »

Tu veux quand même l'appliquer (ça assouplira le système local) ?
```

Attendre confirmation. Si l'user confirme → STEP 4. Sinon → annuler.

Si la Section 7 n'a pas de `### Don't` (DESIGN.md minimal) : skip 3b silencieusement.

**Distinction** : 3a est un blocage par défaut (P0 universel, refus). 3b est une question (le DS local peut évoluer si l'user décide).

## STEP 4 — Edit ciblé

**Un seul Edit par sub-bloc touché.** Format :

```
Edit designs/active.md
  old_string: "<bullet ou ligne complète à remplacer, avec assez de contexte pour être unique>"
  new_string: "<même structure, valeur modifiée>"
```

Règles :

- **Préserver la structure** du bullet : `- **<Name>** (`<value>`): <description>` → seule la `<value>` (et éventuellement la `<description>` si pertinent) change.
- **Light + dark mélangés** (Pattern A : tokens dark inline dans `### Surface & Background`) : 2 Edits ciblés si l'user demande la modif sur les deux scopes.
- **Dark Mode séparé** (Pattern B) : Edit dans `### Dark Mode` + Edit miroir dans light **uniquement si demandé explicitement** ("primary plus chaud, dark aussi").
- **Changement de hex** : ne PAS convertir en OKLCH ici. Stocker dans le format d'origine du DESIGN.md (hex/rgba/oklch — `design-apply` convertira au build CSS).

**Limites Edit** :

Si Edit échoue (`old_string` non unique ou non trouvé) : 2 tentatives max avec contexte élargi, puis abort :

```
❌ Edit ciblé impossible (sub-bloc <X> ambigu ou introuvable).
   Le DESIGN.md a peut-être un format inattendu. Possibilités :
   - Inspecte manuellement designs/active.md ligne <Y>
   - Réécris from scratch via `design-from-brief`
```

## STEP 5 — Re-Read (audit trail)

```
Read designs/active.md
```

Vérifier sur le contenu relu :

- Le bullet/ligne ciblé contient bien la nouvelle valeur.
- Les 9 H2 numérotés sont toujours présents (`^## [1-9]\. `).
- Les sub-headings des 8 sections non touchées sont préservés.

Si une vérif échoue : Edit corrigeant + re-Read. Max 2 tentatives, sinon abort comme STEP 4.

**Cette lecture est obligatoire** — c'est elle qui force la boucle disque et empêche de "deviner" que l'Edit a réussi (équivalent au read-after-write de `design-apply`).

## STEP 6 — Report user (4 lignes max)

```
✓ designs/active.md mis à jour : <section/sub-bloc> → <résumé du tweak>
✓ <N> sections inchangées, schéma 9-H2 OK
→ Pour matérialiser dans le CSS : `design-apply` (régénère src/styles/globals.css)
→ Pour itérer : `design-refine` ("encore plus chaud", "radius +1 cran"...)
```

La 3ème ligne est **non-négociable**. L'user doit savoir que le CSS n'a pas bougé et qu'il faut invoquer `design-apply` pour voir le rendu.

## Anti-patterns à éviter

- **Régénérer `globals.css`** : interdit, c'est le rôle de `design-apply`. Le split est intentionnel — laisser l'user décider quand matérialiser.
- **Write complet** au lieu d'Edit : perte de garantie de préservation des 8 sections non touchées. Si Edit ne marche pas, c'est un signal d'abort, pas de fallback Write.
- **Skipper le re-Read STEP 5** : non-négociable. Force la boucle disque.
- **Ignorer le craft check 3a** : les 7 péchés cardinaux sont P0, non négociables sauf confirmation explicite de l'user.
- **Modifier >2 sections en un seul appel** : redirige vers décomposition.
- **Auto-extrapoler dark depuis light** : seulement si l'user le demande explicitement.
- **Auto-invoquer `design-apply`** : v1 le faisait, v2 split. Suggérer seulement.
