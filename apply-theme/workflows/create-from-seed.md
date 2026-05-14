# Workflow `create-from-seed`

Créer `designs/active.md` à partir d'un fichier seed dans `.claude/skills/apply-theme/library/`.

## Quand l'utiliser

L'user dit "comme stripe", "inspired by linear", "in the style of vercel", "fais-moi un thème claude". Tout signal de référence à un brand connu ou à un système nommé.

## Pré-requis

`.claude/skills/apply-theme/library/` existe et contient des fichiers `.md` (seeds du catalogue importé depuis open-design). Si vide → fallback sur `create-from-brief.md` avec le nom de la marque comme brief.

## Checklist forced-order

```
STEP 0 — Détecter le seed correspondant + overwrite check
STEP 1 — Read .claude/skills/apply-theme/library/<slug>.md
STEP 2 — Adapter (si demandé par user) + Write designs/active.md
STEP 3 — Re-Read designs/active.md (audit trail)
STEP 4-6 — Charger workflows/apply-to-css.md à partir de STEP 4
```

## STEP 0a — Trouver le seed

```
ls .claude/skills/apply-theme/library/
```

Sur la liste, faire un fuzzy match case-insensitive sur le terme de l'user :
```
ls .claude/skills/apply-theme/library/ | grep -i <terme>
```

Cas de résultat :

- **Exactement 1 match** → confirmer à l'user :
  ```
  Trouvé : .claude/skills/apply-theme/library/<slug>.md
  Démarre depuis ce seed ? Tu peux aussi me demander d'adapter
  (ex: "la même mais en mode warm", "avec primary vert", "version sombre forcée").
  ```

- **Plusieurs matchs** :
  ```
  Plusieurs seeds correspondent :
  - .claude/skills/apply-theme/library/stripe.md
  - .claude/skills/apply-theme/library/stripe-press.md
  Choisis ou décris ce que tu veux d'autre.
  ```

- **0 match** → demander à l'user :
  ```
  Pas de seed correspondant à "<terme>" dans .claude/skills/apply-theme/library/.
  Je peux :
  1. Lister les seeds disponibles
  2. Créer un thème depuis un brief texte (passe en mode create-from-brief)
  ```

## STEP 0b — Overwrite check

Si `designs/active.md` existe :
```
designs/active.md existe déjà. Le seed va l'écraser.
Confirme ou demande un refine à la place.
```

## STEP 1 — Read seed

```
Read .claude/skills/apply-theme/library/<slug>.md
```

Charger tout le contenu en mémoire.

## STEP 2 — Adapter si demande user

### Cas A : "comme stripe" (sans adaptation)
Copier le contenu du seed à l'identique dans `designs/active.md`. Ne rien modifier.

### Cas B : "comme stripe mais en sombre"
- Ouvrir la section Color du seed
- Inverser/adapter les valeurs Light pour devenir Dark si le seed était light-only
- Si le seed contient déjà light+dark, garder dark tel quel, demander à l'user s'il veut adapter aussi le light
- Préserver les 8 autres sections

### Cas C : "comme stripe avec primary vert"
- Identifier le primary actuel du seed
- Remplacer par la valeur verte demandée (en hex) ou inférer (en signalant l'inférence)
- Adapter le primary-foreground si nécessaire (cf. `references/shadcn-tokens.md`)
- Préserver tout le reste

### Cas D : "comme stripe, version éditoriale"
- Modif plus large, toucher Typography (passer en serif) + Components (radius plus discret) + Voice & Brand
- Toujours préserver le squelette des 9 sections

Dans tous les cas : **écrire le DESIGN.md complet**, pas un diff.

## STEP 2 bis — Vérifier dark mode

Le seed peut être incomplet (pas de dark, fréquent dans certains catalogues). Après copie + adaptation :

Si le DESIGN.md résultant n'a pas de `Dark:` complet dans Color (4 hex minimum) :
```
Le seed "<slug>" n'a pas de palette dark complète. shadcn la requiert.

Tu veux :
1. Me donner les hex dark
2. Me laisser proposer + valider
3. Abandonner

(Auto-derive automatique pas disponible en v1.)
```

Attendre la réponse avant STEP 3.

## STEP 2 ter — Écriture

```
Write designs/active.md <contenu>
```

Le nom (H1) peut être préservé ou modifié pour refléter l'adaptation (ex: "Stripe-inspired (warm variant)").

## STEP 3 — Re-Read

```
Read designs/active.md
```

Obligatoire.

## STEP 4-6

Charger `workflows/apply-to-css.md` à partir de STEP 4. Le report STEP 6 mentionne le seed d'origine :

```
✓ designs/active.md créé depuis .claude/skills/apply-theme/library/<slug>.md
✓ src/styles/globals.css écrit (32 tokens × 2 scopes, OKLCH)
→ Lance `pnpm dev` et ouvre /showcase pour valider
→ Demande des ajustements ("primary plus chaud") pour itérer
```

## Interdits

- Adapter le seed sans copier les 8 autres sections à l'identique
- Skip le dark check si le seed est incomplet
- Écrire globals.css avant designs/active.md
