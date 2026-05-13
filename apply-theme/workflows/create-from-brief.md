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

Depuis le brief, extraire ou inférer :

### Visual Theme (section 1)
2–3 phrases qui résument l'ambiance. Reformuler le brief de l'user dans le vocabulaire design.

### Color (section 2) — le plus délicat

L'user peut donner :
- **Hex explicites** : `"primary #ff5500"` → utiliser tels quels
- **Adjectifs colorés** : "terracotta", "soft pink", "navy" → inférer un hex plausible (mais signaler à l'user que c'est inféré)
- **Rien sur les couleurs** : demander à l'user les 4 hex minimum (primary, background, foreground, destructive) pour Light ET Dark — ne PAS inventer 100% silencieusement

Règle de prudence : **si plus de 50% des valeurs sont inférées**, lister les couleurs à l'user et demander confirmation avant l'écriture :
```
J'ai inféré ces couleurs depuis ton brief :
  primary: #d2691e (terracotta)
  background: #fff8f3
  foreground: #2b1810
  destructive: #c0392b

Et pour le dark :
  primary: #f4a460
  background: #1a0e08
  foreground: #fff8f3
  destructive: #e74c3c

OK ou tu corriges ?
```

### Typography (section 3)
- Si l'user mentionne explicitement une famille (« typo serif », « Inter », etc.) → utiliser
- Sinon défaut Inter sans + JetBrains mono

### Spacing & Grid (section 4)
Défaut Tailwind v4 sauf si l'user demande explicitement densité/aération particulière.

### Layout & Composition (section 5)
2–3 phrases de patterns inférés depuis le mood (ex: "cards à plat", "hero centré", "grille dense").

### Components (section 6)
Radius inféré depuis le mood :
- "soft", "warm", "friendly" → 0.5–0.75rem
- "modern", "tech" → 0.375–0.5rem
- "brutalist", "raw" → 0 ou 0.125rem
- "luxe", "editorial" → 0.25rem

### Motion & Interaction (section 7)
Si rien de mentionné → laisser vide (Tailwind v4 défauts).
Si "snappy", "fast" → durations basses.
Si "smooth", "gentle" → durations plus longues + easings doux.

### Voice & Brand (section 8)
Si l'user a donné un ton → reformuler. Sinon "défaut neutre".

### Anti-patterns (section 9)
Inférer 3–5 don'ts cohérents avec le brief. Ex: un thème "minimaliste" → anti-patterns "pas de gradients", "pas de shadows lourdes".

## STEP 1.5 — Dark mode

Si le brief ne précise pas le dark, **toujours demander** :

```
Le brief n'a pas précisé la palette dark. shadcn requiert un dark explicite.

Tu veux :
1. Me donner 4 hex pour le dark (primary, background, foreground, destructive)
2. Me laisser proposer 4 hex dark cohérents avec le light, puis valider
3. Abandonner pour l'instant

(Auto-derive automatique pas disponible en v1.)
```

Si l'user choisit (2), proposer les 4 hex et attendre validation avant STEP 2.

## STEP 2 — Écriture

Suivre `references/design-md-schema.md` pour le format exact. Vérifier mentalement avant `Write` :
- H1 (nom court inventé depuis le brief)
- `> Category:` (deviner depuis le brief ou `Other`)
- Les 9 H2 dans l'ordre
- Section Color avec `Light:` et `Dark:` chacune avec 4 hex minimum

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
