# Workflow `create-from-screenshot`

Créer `designs/active.md` depuis une image jointe par l'user (mockup, screenshot d'app, photo, etc.).

## Quand l'utiliser

L'user a joint une image (capture d'écran, mockup Figma, photo de packaging, etc.) et demande "fais-moi un thème inspiré de ça" ou similaire.

## Capacité de vision

Tu vois l'image directement via la modalité vision de Claude. Pas besoin de tool externe. Tu peux :
- Identifier les couleurs dominantes (échantillonner les pixels mentalement)
- Lire le texte présent (titres, body, captions, labels)
- Identifier la famille typographique générale (serif / sans / mono, et style — moderne, classique, condensed, etc.)
- Estimer le radius des composants visibles (boutons, cards, inputs)
- Décrire l'ambiance (densité, espace, contraste)

## Checklist forced-order

```
STEP 0 — Overwrite check si designs/active.md existe
STEP 1 — Analyser l'image : couleurs, typo, radius, ambiance
STEP 1.5 — Confirmer les valeurs avec l'user avant écriture
STEP 2 — Write designs/active.md (9 sections, light + dark)
STEP 3 — Re-Read designs/active.md (audit trail)
STEP 4-6 — Charger workflows/apply-to-css.md à partir de STEP 4
```

## STEP 0 — Overwrite check

Si `designs/active.md` existe :
```
designs/active.md existe déjà. L'analyse de l'image va l'écraser.
Confirme ou demande un refine à la place.
```

## STEP 1 — Analyse de l'image

### Couleurs
Identifier 4–6 hex saillants :
- **primary** : la couleur d'action / accent dominante (boutons, liens, CTA)
- **background** : le fond principal de l'interface
- **foreground** : la couleur du texte principal
- **destructive** : si un état d'erreur/danger est visible, sinon inférer un rouge cohérent

Bonus si visible : secondary, accent, border, muted.

**Échantillonner les vraies valeurs**, pas inventer. Donner les hex au plus proche de ce qui est visible.

### Typographie
- Famille (sans / serif / mono / display)
- Si reconnaissable (Inter, Helvetica, SF Pro, Geist, Söhne, Playfair, etc.) → nommer
- Sinon → stack générique de la bonne famille

### Radius
Estimer depuis les composants visibles :
- Boutons + inputs : taille du radius
- Cards : peut différer
Reporter une valeur unique pour `--radius` (la plus représentative).

### Ambiance
2–3 phrases : densité (aérée / dense), contraste (élevé / doux), atmosphère (corporate / créatif / playful / minimal), tonalité chromatique (chaud / froid / neutre).

## STEP 1.5 — Confirmer avec l'user

**Toujours** afficher tes observations avant d'écrire le DESIGN.md (format final = open-design canonique) :

```
Voilà ce que j'ai extrait de l'image, à intégrer dans `## 2. Color Palette & Roles` :

### Primary Brand
- Primary: #635bff

### Neutrals
- Canvas: #ffffff
- Surface: #ffffff

### Text
- Title: #0a2540
- Paragraph: #425466

### Semantic
- Danger: #df1b41

Typo (## 3. Typography Rules → ### Font Family) : Inter (sans), JetBrains Mono (mono)
Radius (## 4. Component Stylings) : ~0.375rem
Ambiance (## 1. Visual Theme) : corporate épuré, contraste élevé, mood froid/professionnel

L'image semble être en mode light. Pour le sous-bloc `### Dark Mode`, je peux :
1. Te demander 4 hex dark
2. Proposer 4 hex dark cohérents et tu valides
3. Abandonner

OK pour ces extractions ? Tu veux ajuster avant que je génère le DESIGN.md ?
```

Attendre validation user. Itérer si nécessaire ("plutôt cassis pour le primary", "le foreground est plus chaud que ça"...).

## STEP 1.6 — Dark mode

Cas typiques :

- **Image en light only** → demander dark à l'user (cf. message ci-dessus)
- **Image en dark only** → demander light
- **Image avec light + dark côte à côte** (rare mais possible — design system showcase, toggle visible) → extraire les deux

Toujours dark mode obligatoire avant STEP 2.

## STEP 2 — Écriture

Une fois user OK + dark obtenu :

Construire le DESIGN.md complet (9 sections numérotées) selon [`references/design-md-schema.md`](../references/design-md-schema.md). Inférer les sections non visibles dans l'image :
- `## 5. Layout Principles` : décrire les patterns visibles (grille, hero, density)
- `## 6. Depth & Elevation` : depth observable (shadows présents/absents) ; motion = laisser flat (pas observable dans un screenshot statique)
- `## 7. Do's and Don'ts` : 3–5 items par sous-liste, cohérents avec l'esthétique observée
- `## 8. Responsive Behavior` : défaut Tailwind v4 (rarement déductible d'un screenshot unique)
- `## 9. Agent Prompt Guide` : 2–3 phrases de voice inférées du contexte visible

```
Write designs/active.md <contenu complet>
```

## STEP 3 — Re-Read

```
Read designs/active.md
```

## STEP 4-6

Charger `workflows/apply-to-css.md` à partir de STEP 4. Le report STEP 6 mentionne la source :

```
✓ designs/active.md créé depuis l'image fournie
✓ src/styles/globals.css écrit (32 tokens × 2 scopes, OKLCH)
→ Lance `pnpm dev` et ouvre /showcase pour valider visuellement
→ Ajuste via conversation si le résultat ne matche pas l'image
```

## Interdits

- Inventer des couleurs au lieu de les échantillonner réellement
- Skip STEP 1.5 (toujours valider avec l'user avant Write)
- Écrire globals.css avant designs/active.md
- Considérer un seul mode (light OU dark) comme suffisant
