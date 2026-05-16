---
name: design-from-screenshot
description: |
  Génère un `designs/active.md` depuis un screenshot (UI, landing page, app
  mobile, image d'inspiration). Extraction visuelle conservatrice : palette
  observée, typo identifiée (famille + hiérarchie), layout, mood, style des
  composants visibles. Étape de **confirmation user obligatoire** avant Write
  pour éviter les hallucinations couleurs. Garde-fou anti-AI-slop intégré.
  Trigger : "from screenshot", "DS depuis cette image", "extrait le design de
  ce screenshot", "génère un DS qui ressemble à ça".
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
  craft:
    requires: [anti-ai-slop, color, typography]
  inputs:
    primary: screenshot
  outputs:
    primary: designs/active.md
---

# Skill `design-from-screenshot`

Tu extrais un `designs/active.md` depuis un screenshot (image PNG/JPG d'une UI : landing page, dashboard, app mobile, page éditoriale...). Workflow : Read image → extraction structurée des 8 dimensions visibles → **confirmation user obligatoire** sur les valeurs extraites → anti-pattern check → Write → report.

## Background

Pourquoi un step de confirmation explicite (vs `design-from-brief` qui Write directement) ? L'extraction visuelle est **fragile** :

1. **Hallucination couleurs** : un LLM peut "voir" `#6366f1` là où la couleur réelle est `#5B21B6`. Pas de pipette pixel-perfect en vision native.
2. **Typo invisible** : sans CSS source, identifier "Inter" vs "DM Sans" vs "Söhne" est probabiliste — surtout sur petits glyphes.
3. **Mood subjectif** : "playful" vs "professional_minimal" peut basculer sur un seul détail (radius des cards, weight des H1).

Solution : extraire honnêtement ce qui est observable, présenter la résolution proposée à l'user, attendre validation/correction. Mieux 30s d'aller-retour qu'un DESIGN.md qui dérive subtilement de la référence.

## Invariants (jamais violer)

- Écrit **un seul fichier** : `designs/active.md`. Si présent → demande confirmation overwrite.
- Ne touche **jamais** : `src/styles/globals.css`, `tailwind.config.*`, `.tsx`, ni les seeds.
- Ordre forcé : Read image → extraction → **présentation user pour validation** → anti-pattern check → check overwrite → Write → re-Read → report.
- **Étape de confirmation user non-skippable** entre extraction et Write. Pas d'auto-Write basé sur l'extraction seule.
- Le report **suggère explicitement** `design-apply` comme prochain pas. Ne pas auto-invoquer.
- Format de sortie : 9 sections H2 numérotées strict (cf. `_shared/design-md-schema.md`).

## Références à charger

- [`skills/_shared/design-md-schema.md`](../_shared/design-md-schema.md) — format DESIGN.md (9 sections numérotées)
- [`skills/_shared/craft/anti-ai-slop.md`](../_shared/craft/anti-ai-slop.md) — 7 péchés cardinaux P0
- [`skills/_shared/craft/color.md`](../_shared/craft/color.md) — palette structure 4 layers, accent discipline
- [`skills/_shared/craft/typography.md`](../_shared/craft/typography.md) — type scale, letter-spacing, font pairing
- [`skills/design-from-brief/SKILL.md`](../design-from-brief/SKILL.md) — squelette des 9 sections + tables symbolic→concrete (réutilisé pour la composition)

## STEP 1 — Read image

```
Read <path-du-screenshot.png>   (ou JPG, WebP — tout format raster supporté)
```

Si pas de path fourni dans le brief user :

```
❌ Aucun screenshot fourni. Indique le path d'une image (PNG/JPG/WebP) :
   - "from screenshot ./inspiration.png"
   - "DS depuis ~/Downloads/figma-export.jpg"
```

Stop. Pas d'extraction sans image.

Si plusieurs images fournies → traiter la première comme référence principale ; mentionner les autres comme "secondary refs" dans la confirmation STEP 3.

## STEP 2 — Extraction structurée (8 dimensions)

Observer l'image et remplir chaque dimension. **Marquer le niveau de confiance** (high / medium / low) pour chaque valeur — c'est ce qui guide la confirmation user au STEP 3.

### 2a. Palette (la plus risquée — être conservateur)

Identifier 4-8 couleurs dominantes :

| Rôle | Méthode d'extraction | Confiance attendue |
|---|---|---|
| Background | Couleur de la zone la plus large (typiquement le canvas hors header/footer) | high |
| Card / Surface | Couleur des containers élevés (cards, modals visibles) | medium si peu d'élévation visible |
| Foreground | Couleur du texte body majoritaire | high |
| Muted Foreground | Texte secondaire (captions, meta) | medium |
| Primary / Accent | Couleur des CTA primaires (bouton principal, link de nav actif) | medium-high |
| Border | Séparateurs entre sections, bordures de cards | low si bordures discrètes |

**Règles de prudence** :
- Donner les hex en **3-decimal hex** (`#3B82F6`, pas `#3b82f5` approximatif). Si incertain entre 2 valeurs proches, lister les 2 et marquer `low`.
- Si l'image est petite, compressée, ou screenshot d'un screenshot → marquer toute la palette `low` et le signaler au STEP 3.
- Si dark mode visible (toggle, ou screenshot pris en thème sombre) → extraire **2 scopes** light + dark si possible. Sinon : extraire le scope visible, dériver l'autre au STEP 5 (table de design-from-brief).

### 2b. Typographie

| Aspect | Méthode | Confiance attendue |
|---|---|---|
| Family body | Identifier sans/serif/mono. Si possible, deviner la famille (Inter, Söhne, DM Sans, Playfair, Georgia...) | medium pour sans génériques, low pour identification précise |
| Family display (H1, hero) | Souvent même famille que body, parfois différente (display contrasté) | medium |
| Hiérarchie observable | Compter les niveaux distincts (H1, H2, body, caption) | high |
| Weight body | 400 / 450 / 500 selon l'épaisseur perçue | medium |
| Weight headlines | 600 / 700 selon le contraste vs body | medium |

**Règles** :
- Si famille incertaine → proposer une approximation crédible (`Inter` pour sans neutre moderne, `Söhne`/`Aeonik` pour sans editorial, `Playfair` pour serif display) **et** marquer `low`.
- Toujours déclarer la stack avec system fallback (`'Inter', ui-sans-serif, system-ui, sans-serif`).

### 2c. Layout & density

| Aspect | Méthode | Confiance attendue |
|---|---|---|
| Layout model | `single_column` (stack vertical) / `two_column` (sidebar) / `asymmetric` (grid décalé) | high |
| Max width | Estimer la largeur du contenu en px | medium |
| Density | `compact` (info-rich, peu d'air) / `balanced` (équilibré) / `spacious` (lots of whitespace) | medium-high |
| Section spacing | Estimer en px (48 / 72 / 96) | low (estimation visuelle) |

### 2d. Composants visibles

Pour chaque composant identifiable, noter le style :

| Composant | À observer |
|---|---|
| Boutons | Radius (carré 0 / md 4-6px / pill 9999px), bg (accent / surface / ghost), border (none / 1px / 2px) |
| Cards | Radius, border (visible / hairline / none), shadow (none / subtle / hard) |
| Inputs | Style (transparent + bottom border / outlined / filled), radius |
| Navigation | Top bar / sidebar / bottom tab, density |

### 2e. Mood (déduction esthétique)

| Mood | Signaux visuels |
|---|---|
| `professional_minimal` | Palette restreinte, grille rigoureuse, peu d'ornement, sans-serif neutre |
| `playful` | Radius ronds (cards rounded-xl, boutons pill), accents saturés, illustrations, mascot |
| `brutalist` | Contrastes francs, bordures épaisses, hard shadows, grilles exposées, typo display imposante |
| `editorial` | Serif display, hiérarchie marquée, ratios verticaux généreux, palette muted |

Confiance attendue : medium — c'est l'agrégation des 4 autres dimensions.

### 2f. Constraints observées (`exclude`)

Si le screenshot est ostensiblement statique (pas de motion blur, pas d'éléments en mouvement, design system clairement statique) → marquer `exclude=animations` comme observation (vs déduction).
Si gradient hero présent → ne PAS l'inclure dans `exclude` (au contraire : le mentionner dans la palette/section 6).

## STEP 3 — Présentation user pour validation (NON-SKIPPABLE)

Format strict :

```
J'ai analysé <path-du-screenshot>. Voici la résolution proposée :

PALETTE (confiance: <H/M/L>)
- Background : `#XXXXXX`
- Card / Surface : `#XXXXXX`
- Foreground : `#XXXXXX`
- Muted Foreground : `#XXXXXX`
- Primary / Accent : `#XXXXXX`
- Border : `#XXXXXX`
<si dark visible : ajouter section DARK MODE>
<si dark NON visible : "Dark mode : non visible dans le screenshot — sera dérivé mécaniquement par design-apply, ou précise les valeurs dark si tu les as">

TYPOGRAPHIE (confiance: <H/M/L>)
- Body : <famille proposée>, weight <X>, <stack avec fallback>
- Display : <famille proposée>, weight <Y>
- Note : <si low confidence, expliquer ; ex "Le sans-serif visible peut être Inter, Söhne, ou Aeonik — j'ai mis Inter par défaut">

LAYOUT (confiance: <H/M/L>)
- Modèle : <single_column / two_column / asymmetric>
- Max width estimée : <Xpx>
- Density : <compact / balanced / spacious>

COMPOSANTS (confiance: <H/M/L>)
- Boutons : radius <X>, <style>
- Cards : radius <X>, <border>, <shadow>
- Inputs : <style>

MOOD : <professional_minimal / playful / brutalist / editorial> (confiance: <H/M/L>)

CONSTRAINTS observées : <liste ou "aucune">

⚠️ Vérifie surtout les valeurs marquées (M) ou (L). Confirme :
1. ✅ Tout est OK, génère le DESIGN.md
2. 🔧 Corrige : <indique les valeurs à ajuster, ex "Primary est plutôt #2563EB", "typo body c'est DM Sans">
3. ❌ Annule
```

**Attendre la réponse user.** Pas de Write avant validation explicite (option 1) ou correction puis validation (option 2).

Si l'user choisit option 2 → appliquer les corrections, ré-afficher la résolution corrigée, re-demander validation.

## STEP 4 — Anti-pattern check (P0 bloquant)

Une fois la résolution validée par l'user, vérifier les péchés cardinaux de [`_shared/craft/anti-ai-slop.md`](../_shared/craft/anti-ai-slop.md) :

| Check | Action si violé |
|---|---|
| Accent ∈ `{#6366f1, #4f46e5, #4338ca, #3730a3, #8b5cf6, #7c3aed, #a855f7}` | Bloquer + signaler à l'user : "L'accent extrait/confirmé est l'indigo Tailwind par défaut. C'est aussi le tell #1 des UIs LLM-generated. Le screenshot original utilise peut-être vraiment cette teinte — confirme une 2ème fois ou propose une alternative." |
| Typo body = `system-ui` seule sur les headings (pas de famille intentional) | Warning : suggérer d'ajouter une famille first-choice (Inter, DM Sans...) avant `system-ui` |
| Gradient 2-stops "trust" extrait en hero | OK pour l'inclure (l'image l'a) **mais** émettre `## 7. Don't` qui interdit de le réutiliser ailleurs (cap : 1 usage hero seulement) |

Si l'user confirme malgré le warning P0 → appliquer (la référence visuelle prime sur la règle anti-AI-slop quand validation explicite).

## STEP 5 — Check overwrite + Write

Si `designs/active.md` existe déjà :

```
designs/active.md existe déjà. Tu veux :
1. L'écraser avec le DS extrait du screenshot (perte du contenu actuel)
2. Annuler (pour modifier l'existant, utilise `design-refine`)
```

Attendre confirmation explicite.

Composer le DESIGN.md selon le squelette des 9 sections **identique à `design-from-brief` STEP 6** (cf. [`../design-from-brief/SKILL.md`](../design-from-brief/SKILL.md) section "Composer le DESIGN.md selon le squelette ci-dessous"). Réutiliser ce squelette pour cohérence inter-skill (même structure de sub-headings Section 2, même ordre des composants Section 4).

Différences vs `design-from-brief` :
- **H1** : préfixer par `Design System Inspired by <référence visuelle>` si l'user a précisé la marque source ; sinon `Design System Extracted from Screenshot`.
- **Section 1 Visual Theme** : ajouter une ligne `- Source : extrait du screenshot <path>, validé user le <date implicite>`.
- **Section 9 Agent Prompt Guide** : conserver le voice dérivé du mood, pas de mention de la source (le DS est autonome après extraction).

Write `designs/active.md` avec le contenu composé.

## STEP 6 — Re-Read + Report

```
Read designs/active.md
```

Vérifier sur le contenu relu :
- H1 présent.
- 9 H2 numérotés présents et dans l'ordre.
- Section 2 contient les hex validés par l'user (grep sur 1-2 valeurs pivots pour confirmer).
- Aucun hex hors palette validée n'a été inséré dans Section 2.

Si vérif échoue : Edit ciblé + re-Read. Max 2 tentatives, sinon abort.

Report final :

```
✓ designs/active.md généré depuis <path-du-screenshot>
✓ 9 sections OK, palette validée par l'user (<N> couleurs core)
ℹ Confiance globale : <high / medium / low — moyenne pondérée des dimensions>
<si dark dérivé : "ℹ Dark mode dérivé mécaniquement (non visible dans le screenshot) — review via design-refine si besoin">
→ Pour matérialiser dans le CSS : `design-apply` (génère src/styles/globals.css)
→ Pour itérer : `design-refine` ("primary plus chaud", "radius plus grand"...)
```

## Anti-patterns à éviter

- **Skipper la confirmation user STEP 3** : non-négociable. C'est ce qui distingue ce skill du `from-brief`. L'extraction visuelle est intrinsèquement fragile, l'aller-retour user est le garde-fou.
- **Marquer `high` partout** : honnêteté > réassurance. Si une couleur est extraite d'un petit bouton 16x16px sur un screenshot compressé, c'est `low`. Le marquer.
- **Inventer des sections non visibles** : le screenshot ne montre que ce qui est visible. Pour Section 8 Responsive, Section 9 Agent Prompt Guide → utiliser des défauts cohérents (cf. `design-from-brief`), ne pas extrapoler depuis l'image.
- **Pipette pixel-perfect imaginaire** : ne pas prétendre lire `#3B82F6` à 3 décimales si l'image est 800x600 JPG compressé. Marquer `medium` ou `low`, demander confirmation user.
- **Auto-invoquer `design-apply`** : split v2, suggérer seulement.
- **Réécrire le squelette des 9 sections** : réutiliser celui de `design-from-brief/SKILL.md` STEP 6 pour cohérence (même format consommé par `design-apply`).
- **Émettre du HTML preview** : hors scope v1.
